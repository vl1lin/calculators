// =============================================================================
// PVT Correlations Library
// Petroleum engineering correlations for Gas Content (Rs), Volume Factor (Bo),
// and Saturation Pressure (Pb)
// =============================================================================

export interface ApplicabilityLimits {
  pressure?: { min: number; max: number };
  temperature?: { min: number; max: number };
  gasGravity?: { min: number; max: number };
  oilAPI?: { min: number; max: number };
  Rs?: { min: number; max: number };
}

export interface RsCorrelation {
  id: string;
  name: string;
  author: string;
  year: number;
  origin: string;
  formulaLatex: string;
  reference: string;
  limits: ApplicabilityLimits;
  needsSeparatorParams: boolean;
  calculate: (P: number, T: number, gamma_g: number, API: number, P_sp?: number, T_sp?: number) => number;
}

export interface BoCorrelation {
  id: string;
  name: string;
  author: string;
  year: number;
  origin: string;
  formulaLatex: string;
  limits: ApplicabilityLimits;
  calculate: (Rs: number, T: number, gamma_g: number, API: number) => number;
}

export interface PbCorrelation {
  id: string;
  name: string;
  author: string;
  year: number;
  origin: string;
  formulaLatex: string;
  limits: ApplicabilityLimits;
  calculate: (Rs: number, gamma_g: number, API: number, T: number) => number;
}

// =============================================================================
// GAS CONTENT (Rs) CORRELATIONS
// =============================================================================

export const rsCorrelations: RsCorrelation[] = [
  {
    id: 'standing',
    name: 'Standing (1947)',
    author: 'Standing',
    year: 1947,
    origin: 'California, США',
    formulaLatex: 'R_s = \\gamma_g \\left(\\frac{P}{18.2} + 1.4\\right)^{10^{x}}, \\quad x = 0.0125 \\cdot API - 0.00091 \\cdot T',
    reference: 'Standing, M. B. (1947). Volumetric and Phase Behavior of Oil Field Hydrocarbon Systems. Reinhold Publishing Corp.',
    limits: { pressure: { min: 130, max: 7000 }, temperature: { min: 100, max: 258 }, gasGravity: { min: 0.59, max: 0.95 }, oilAPI: { min: 16.5, max: 63.8 } },
    needsSeparatorParams: false,
    calculate: (P, T, gamma_g, API) => {
      const x = 0.0125 * API - 0.00091 * T;
      const exponent = Math.pow(10, x);
      const Rs = gamma_g * Math.pow((P / 18.2) + 1.4, exponent);
      return Math.max(0, Rs);
    }
  },
  {
    id: 'lasater',
    name: 'Lasater (1958)',
    author: 'Lasater',
    year: 1958,
    origin: 'Midcontinent U.S., Canada, South America',
    formulaLatex: 'R_s = 132755 \\cdot \\frac{\\gamma_o \\cdot x_g}{M_o \\cdot \\gamma_g}, \\quad x_g \\text{ — мольная доля газа}',
    reference: 'Lasater, J. A. (1958). Bubble Point Pressure Correlation. Trans. AIME, 213, 379-381.', // оригинальное название статьи
    limits: { pressure: { min: 48, max: 5780 }, temperature: { min: 82, max: 272 }, gasGravity: { min: 0.57, max: 1.22 }, oilAPI: { min: 17, max: 39 } },
    needsSeparatorParams: false,
    calculate: (P, T, gamma_g, API) => {
      const gamma_o = 141.5 / (API + 131.5);
      const M_o = 204 + 0.0001 * Math.pow(500, 1.3);
      const pf = P / (T + 459.67) * gamma_g;
      let xg: number;
      if (pf > 0) {
        xg = 0.15649 + 0.33705 * Math.log(pf + 0.59162);
      } else {
        xg = 0.1;
      }
      const Rs = 132755 * gamma_o * xg / (M_o * gamma_g);
      return Math.max(0, Rs);
    }
  },
  {
    id: 'vazquez',
    name: 'Vasquez & Beggs (1980)',
    author: 'Vasquez and Beggs',
    year: 1980,
    origin: 'Worldwide (6004 анализа)',
    formulaLatex: 'R_s = C_1 \\cdot \\gamma_{gc} \\cdot P^{C_2} \\cdot \\exp\\!\\left(\\frac{C_3 \\cdot API}{T+460}\\right)',
    reference: 'Vasquez, M., & Beggs, H. D. (1980). Correlations for Fluid Physical Property Prediction. JPT, 32(06), 968-974.',
    limits: { pressure: { min: 50, max: 5250 }, temperature: { min: 130, max: 320 }, gasGravity: { min: 0.5, max: 1.5 }, oilAPI: { min: 15, max: 60 } },
    needsSeparatorParams: true,
    calculate: (P, T, gamma_g, API, P_sp = 114.7, T_sp = 60) => {
      let C1: number, C2: number, C3: number;
      if (API <= 30) { C1 = 0.0362; C2 = 1.0937; C3 = 25.7240; }
      else { C1 = 0.0178; C2 = 1.1870; C3 = 23.9310; }
      const gamma_gc = gamma_g * (1 + 5.912e-5 * API * T_sp * Math.log10(P_sp / 114.7));
      const Rs = C1 * gamma_gc * Math.pow(P, C2) * Math.exp(C3 * API / (T + 460));
      return Math.max(0, Rs);
    }
  },
  {
    id: 'glaso',
    name: 'Glasø (1980)',
    author: 'Glasø',
    year: 1980,
    origin: 'North Sea (45 образцов)',
    formulaLatex: 'R_s = \\gamma_g \\left(\\frac{P}{10^{x}}\\right)^{1.2048}, \\quad x = 0.00091 \\cdot T - 0.0125 \\cdot API',
    reference: 'Glasø, Ø. (1980). Generalized PVT Correlations. JPT, 32(05), 785-795.',
    limits: { pressure: { min: 400, max: 4000 }, temperature: { min: 80, max: 280 }, gasGravity: { min: 0.65, max: 1.28 }, oilAPI: { min: 22, max: 48 } },
    needsSeparatorParams: false,
    calculate: (P, T, gamma_g, API) => {
      const x = 0.00091 * T - 0.0125 * API;
      const denominator = Math.pow(10, x);
      const Rs = gamma_g * Math.pow(P / Math.max(denominator, 1e-10), 1.2048);
      return Math.max(0, Rs);
    }
  },
  {
    id: 'almarhoun',
    name: 'Al-Marhoun (1988)',
    author: 'Al-Marhoun',
    year: 1988,
    origin: 'Middle East (69 месторождений)',
    formulaLatex: 'R_s = \\left[185.843 \\cdot P \\cdot \\gamma_g^{1.878} \\cdot \\gamma_o^{-3.144} \\cdot (T+460)^{-1.327}\\right]^{1.773}',
    reference: 'Al-Marhoun, M. A. (1988). PVT Correlations for Middle East Crude Oils. JPT, 40(05), 650-666.',
    limits: { pressure: { min: 20, max: 3573 }, temperature: { min: 74, max: 240 }, gasGravity: { min: 0.75, max: 1.37 }, oilAPI: { min: 19, max: 44 } },
    needsSeparatorParams: false,
    calculate: (P, T, gamma_g, API) => {
      const gamma_o = 141.5 / (API + 131.5);
      const a = 185.843, b = 1.87784, c = -3.1437, d = -1.32657, e = 1.77298;
      const inner = a * P * Math.pow(Math.max(gamma_g, 1e-10), b) * Math.pow(Math.max(gamma_o, 1e-10), c) * Math.pow(T + 460, d);
      const Rs = Math.pow(Math.max(inner, 0), e);
      return Math.max(0, Rs);
    }
  },
  {
    id: 'petrosky',
    name: 'Petrosky & Farshad (1993)',
    author: 'Petrosky and Farshad',
    year: 1993,
    origin: 'Gulf of Mexico (81 образец)',
    formulaLatex: 'R_s = \\left[\\left(\\frac{P}{112.727} + 12.340\\right) \\gamma_g^{0.844} \\cdot 10^{x}\\right]^{1.732}',
    reference: 'Petrosky, G. E., & Farshad, F. (1993). PVT Correlations for Gulf of Mexico Crude Oils. SPE ATCE.',
    limits: { pressure: { min: 1500, max: 4500 }, temperature: { min: 115, max: 276 }, gasGravity: { min: 0.58, max: 0.86 }, oilAPI: { min: 16, max: 45 } },
    needsSeparatorParams: false,
    calculate: (P, T, gamma_g, API) => {
      const x = 7.916e-4 * Math.pow(API, 1.5410) - 4.561e-5 * Math.pow(T, 1.3911);
      const inner = (P / 112.727 + 12.340) * Math.pow(Math.max(gamma_g, 1e-10), 0.8439) * Math.pow(10, x);
      const Rs = Math.pow(Math.max(inner, 0), 1.73184);
      return Math.max(0, Rs);
    }
  }
];

// =============================================================================
// OIL FORMATION VOLUME FACTOR (Bo) CORRELATIONS
// =============================================================================

export const boCorrelations: BoCorrelation[] = [
  {
    id: 'standing',
    name: 'Standing (1947)',
    author: 'Standing',
    year: 1947,
    origin: 'California (22 образца)',
    formulaLatex: 'B_o = 0.9759 + 1.2 \\times 10^{-4}\\!\\left[R_s \\left(\\frac{\\gamma_g}{\\gamma_o}\\right)^{\\!0.5} + 1.25(T - 460)\\right]^{1.2}',
    limits: { Rs: { min: 0, max: 2000 }, temperature: { min: 100, max: 258 }, gasGravity: { min: 0.59, max: 0.95 }, oilAPI: { min: 16.5, max: 63.8 } },
    calculate: (Rs, T, gamma_g, API) => {
      const gamma_o = 141.5 / (API + 131.5);
      const term = Rs * Math.sqrt(gamma_g / Math.max(gamma_o, 1e-10)) + 1.25 * (T - 460);
      return 0.9759 + 0.000120 * Math.pow(Math.max(0, term), 1.2);
    }
  },
  {
    id: 'vasquez',
    name: 'Vasquez & Beggs (1980)',
    author: 'Vasquez and Beggs',
    year: 1980,
    origin: 'Worldwide (6004 анализа)',
    formulaLatex: 'B_o = 1 + C_1 R_s + C_2 (T-60)\\!\\left(\\frac{API}{\\gamma_g}\\right) + C_3 R_s (T-60)\\!\\left(\\frac{API}{\\gamma_g}\\right)',
    limits: { Rs: { min: 0, max: 2500 }, temperature: { min: 75, max: 294 }, gasGravity: { min: 0.51, max: 1.35 }, oilAPI: { min: 16, max: 58 } },
    calculate: (Rs, T, gamma_g, API) => {
      let C1: number, C2: number, C3: number;
      if (API <= 30) { C1 = 4.677e-4; C2 = 1.751e-5; C3 = -1.811e-8; }
      else { C1 = 4.670e-4; C2 = 1.100e-5; C3 = 1.337e-9; }
      const ratio = API / Math.max(gamma_g, 1e-10);
      return 1.0 + C1 * Rs + C2 * (T - 60) * ratio + C3 * Rs * (T - 60) * ratio;
    }
  },
  {
    id: 'glaso',
    name: 'Glasø (1980)',
    author: 'Glasø',
    year: 1980,
    origin: 'North Sea (45 образцов)',
    formulaLatex: 'B_o = 1 + 10^{\\,x}, \\quad x = -6.585 + 2.913\\log B_{ob}^* - 0.277(\\log B_{ob}^*)^2',
    limits: { Rs: { min: 90, max: 2600 }, temperature: { min: 80, max: 280 }, gasGravity: { min: 0.65, max: 1.28 }, oilAPI: { min: 22.3, max: 48.1 } },
    calculate: (Rs, T, gamma_g, API) => {
      const B_ob_star = Rs * Math.sqrt(T / Math.max(gamma_g, 1e-10)) + 1.25 * API;
      const logB = Math.log10(Math.max(B_ob_star, 1e-10));
      const x = -6.58511 + 2.91329 * logB - 0.27683 * logB * logB;
      return 1.0 + Math.pow(10, x);
    }
  },
  {
    id: 'almarhoun',
    name: 'Al-Marhoun (1988)',
    author: 'Al-Marhoun',
    year: 1988,
    origin: 'Middle East (69 месторождений)',
    formulaLatex: 'B_o = 1 + a R_s + b(T-520)\\!\\left(\\frac{API}{\\gamma_g}\\right) + c R_s(T-520)\\!\\left(\\frac{API}{\\gamma_g}\\right)',
    limits: { Rs: { min: 20, max: 1900 }, temperature: { min: 130, max: 280 }, gasGravity: { min: 0.75, max: 1.37 }, oilAPI: { min: 19.4, max: 46 } },
    calculate: (Rs, T, gamma_g, API) => {
      const a = 0.001093, b = 0.000658, c = -0.000001;
      const tempDiff = T - 520;
      const ratio = API / Math.max(gamma_g, 1e-10);
      return 1.0 + a * Rs + b * tempDiff * ratio + c * Rs * tempDiff * ratio;
    }
  },
  {
    id: 'petrosky',
    name: 'Petrosky & Farshad (1993)',
    author: 'Petrosky and Farshad',
    year: 1993,
    origin: 'Gulf of Mexico (81 образец)',
    formulaLatex: 'B_o = 1.0113 + 7.205 \\times 10^{-5}\\!\\left[R_s^{0.374}\\!\\left(\\frac{T^{0.627}}{\\gamma_g^{0.323}}\\right) + 0.246 \\cdot API^{0.537}\\right]^{3.094}',
    limits: { Rs: { min: 200, max: 1500 }, temperature: { min: 150, max: 280 }, gasGravity: { min: 0.58, max: 0.86 }, oilAPI: { min: 16, max: 45 } },
    calculate: (Rs, T, gamma_g, API) => {
      const term1 = Math.pow(Math.max(Rs, 0), 0.3738) * (Math.pow(Math.max(T, 0), 0.6265) / Math.pow(Math.max(gamma_g, 1e-10), 0.3232));
      const term2 = 0.24626 * Math.pow(Math.max(API, 0), 0.5371);
      const inner = term1 + term2;
      return 1.0113 + 7.2046e-5 * Math.pow(Math.max(inner, 0), 3.0936);
    }
  }
];

// =============================================================================
// BUBBLE POINT PRESSURE (Pb) CORRELATIONS
// =============================================================================

export const pbCorrelations: PbCorrelation[] = [
  {
    id: 'standing',
    name: 'Standing (1947)',
    author: 'Standing',
    year: 1947,
    origin: 'California, США',
    formulaLatex: 'p_b = 18.2 \\left[\\left(\\frac{R_s}{\\gamma_g}\\right)^{0.83} \\cdot 10^{(0.00091\\,T - 0.0125\\,API)} - 1.4\\right]',
    limits: { Rs: { min: 20, max: 1425 }, gasGravity: { min: 0.59, max: 0.95 }, oilAPI: { min: 16.5, max: 63.8 }, temperature: { min: 100, max: 258 } },
    calculate: (Rs, gamma_g, API, T) => {
      return 18.2 * (Math.pow(Rs / Math.max(gamma_g, 1e-10), 0.83) * Math.pow(10, 0.00091 * T - 0.0125 * API) - 1.4);
    }
  },
  {
    id: 'elam',
    name: 'Elam (1957)',
    author: 'Elam',
    year: 1957,
    origin: 'Texas, США',
    formulaLatex: 'p_b = \\frac{R_s^{0.702}}{\\gamma_g^{0.514}} \\cdot e^{(0.00348\\,T - 0.0282\\,API + 3.58)}',
    limits: { Rs: { min: 100, max: 2000 }, gasGravity: { min: 0.6, max: 1.2 }, oilAPI: { min: 20, max: 50 }, temperature: { min: 120, max: 280 } },
    calculate: (Rs, gamma_g, API, T) => {
      return Math.pow(Rs, 0.702) / Math.pow(Math.max(gamma_g, 1e-10), 0.514) * Math.exp(0.00348 * T - 0.0282 * API + 3.58);
    }
  },
  {
    id: 'lasater',
    name: 'Lasater (1958)',
    author: 'Lasater',
    year: 1958,
    origin: 'Midcontinent U.S.',
    formulaLatex: 'x_g = \\left[1 + \\frac{\\gamma_o}{7.521 \\times 10^{-6} R_s M_o}\\right]^{-1}, \\quad p_b = \\frac{p_f(T+460)}{\\gamma_g}',
    limits: { Rs: { min: 50, max: 1500 }, gasGravity: { min: 0.55, max: 1.3 }, oilAPI: { min: 15, max: 55 }, temperature: { min: 80, max: 300 } },
    calculate: (Rs, gamma_g, API, T) => {
      const gamma_o = 141.5 / (API + 131.5);
      const Mo = 204 + 0.0001 * Math.pow(Math.max(Rs, 0), 1.3);
      const xg = 1 / (1 + gamma_o / (7.521e-6 * Math.max(Rs, 1) * Mo));
      let pf: number;
      if (xg <= 0.15649) {
        pf = Math.exp((xg - 0.15649) / 0.33705) - 0.59162;
      } else {
        pf = Math.exp((xg - 0.15649) / 0.33705);
      }
      return Math.max(0, pf * (T + 460) / Math.max(gamma_g, 1e-10));
    }
  },
  {
    id: 'vazquez',
    name: 'Vazquez & Beggs (1976)',
    author: 'Vazquez and Beggs',
    year: 1976,
    origin: 'Worldwide',
    formulaLatex: 'p_b = \\left[A \\left(\\frac{R_s}{\\gamma_{gc}}\\right) 10^{\\frac{B\\,API}{T+460}}\\right]^C',
    limits: { Rs: { min: 50, max: 2500 }, gasGravity: { min: 0.5, max: 1.5 }, oilAPI: { min: 15, max: 55 }, temperature: { min: 100, max: 350 } },
    calculate: (Rs, gamma_g, API, T) => {
      let A: number, B: number, C: number;
      if (API <= 30) { A = 27.64; B = -11.172; C = 0.9143; }
      else { A = 56.06; B = -10.393; C = 0.8425; }
      const Tsp = 60, Psp = 114.7;
      const gg_c = gamma_g * (1 + 5.912e-5 * API * Tsp * Math.log10(Psp / 114.7));
      const val = A * (Rs / Math.max(gg_c, 1e-10)) * Math.pow(10, B * API / (T + 460));
      return Math.max(0, Math.pow(Math.max(val, 0), C));
    }
  },
  {
    id: 'glaso',
    name: 'Glasø (1980)',
    author: 'Glasø',
    year: 1980,
    origin: 'North Sea',
    formulaLatex: 'p_b = 10^{\\,1.767 + 1.745\\log X - 0.302(\\log X)^2}, \\quad X = \\left(\\frac{R_s}{\\gamma_g}\\right)^{0.816} \\frac{T^{0.172}}{API^{0.989}}',
    limits: { Rs: { min: 100, max: 2000 }, gasGravity: { min: 0.6, max: 1.3 }, oilAPI: { min: 20, max: 50 }, temperature: { min: 120, max: 320 } },
    calculate: (Rs, gamma_g, API, T) => {
      const X = Math.pow(Rs / Math.max(gamma_g, 1e-10), 0.816) * Math.pow(T, 0.172) / Math.pow(Math.max(API, 1e-10), 0.989);
      const logX = Math.log10(Math.max(X, 1e-10));
      return Math.max(0, Math.pow(10, 1.7669 + 1.7447 * logX - 0.30218 * logX * logX));
    }
  },
  {
    id: 'labedi',
    name: 'Labedi (1982)',
    author: 'Labedi',
    year: 1982,
    origin: 'Libya, Nigeria, Angola',
    formulaLatex: 'p_b = \\frac{6.0001}{\\gamma_g}\\left[\\frac{R_s^{0.671}\\left(\\frac{T}{API}\\right)^{0.710} T_{sp}^{0.089}}{10^{7.995 \\times 10^{-5} R_s}}\\right]',
    limits: { Rs: { min: 100, max: 3000 }, gasGravity: { min: 0.55, max: 1.2 }, oilAPI: { min: 25, max: 50 }, temperature: { min: 150, max: 350 } },
    calculate: (Rs, gamma_g, API, T) => {
      const Tsp = 60;
      return Math.max(0, 6.0001 / Math.max(gamma_g, 1e-10) * (Math.pow(Math.max(Rs, 0), 0.6714) * Math.pow(Math.max(T / Math.max(API, 1e-10), 0), 0.7097) * Math.pow(Tsp, 0.08929)) / Math.pow(10, 7.995e-5 * Math.max(Rs, 0)));
    }
  },
  {
    id: 'owolabi1',
    name: 'Owolabi (1984) — Cook Inlet',
    author: 'Owolabi',
    year: 1984,
    origin: 'Alaska, Cook Inlet',
    formulaLatex: 'p_b = 55.0 + 0.864\\left[\\left(\\frac{R_s}{\\gamma_g}\\right)^{1.255} \\frac{T^{0.172}}{API^{0.178}}\\right]',
    limits: { Rs: { min: 50, max: 1500 }, gasGravity: { min: 0.6, max: 1.1 }, oilAPI: { min: 20, max: 45 }, temperature: { min: 100, max: 250 } },
    calculate: (Rs, gamma_g, API, T) => {
      return 55.0 + 0.8643 * (Math.pow(Rs / Math.max(gamma_g, 1e-10), 1.255) * Math.pow(Math.max(T, 0), 0.172) / Math.pow(Math.max(API, 1e-10), 0.178));
    }
  },
  {
    id: 'owolabi2',
    name: 'Owolabi (1984) — North Slope',
    author: 'Owolabi',
    year: 1984,
    origin: 'Alaska, North Slope',
    formulaLatex: 'p_b = -987.6 + 179.6\\left[\\left(\\frac{R_s}{\\gamma_g}\\right)^{0.481} \\frac{T^{0.094}}{API^{0.166}}\\right]',
    limits: { Rs: { min: 100, max: 2000 }, gasGravity: { min: 0.55, max: 1.0 }, oilAPI: { min: 15, max: 40 }, temperature: { min: 80, max: 220 } },
    calculate: (Rs, gamma_g, API, T) => {
      return -987.56359 + 179.58816 * (Math.pow(Rs / Math.max(gamma_g, 1e-10), 0.48088266) * Math.pow(Math.max(T, 0), 0.093538150) / Math.pow(Math.max(API, 1e-10), 0.16648326));
    }
  },
  {
    id: 'almarhoun',
    name: 'Al-Marhoun (1985)',
    author: 'Al-Marhoun',
    year: 1985,
    origin: 'Saudi Arabia',
    formulaLatex: 'p_b = -64.14 + 7.024 \\times 10^{-3} X - 2.278 \\times 10^{-9} X^2, \\quad X = R_s^{0.723} \\frac{\\gamma_o^{3.047}}{\\gamma_g^{1.879}} (T+460)^{1.302}',
    limits: { Rs: { min: 50, max: 2500 }, gasGravity: { min: 0.7, max: 1.3 }, oilAPI: { min: 20, max: 50 }, temperature: { min: 120, max: 300 } },
    calculate: (Rs, gamma_g, API, T) => {
      const gamma_o = 141.5 / (API + 131.5);
      const X = Math.pow(Math.max(Rs, 0), 0.722569) * Math.pow(Math.max(gamma_o, 1e-10), 3.046590) / Math.pow(Math.max(gamma_g, 1e-10), 1.879109) * Math.pow(T + 460, 1.302347);
      return Math.max(0, -64.13891 + 7.02362e-3 * X - 2.278475e-9 * X * X);
    }
  }
];

// =============================================================================
// CHART COLORS for Pb comparison chart
// =============================================================================

export const CHART_COLORS = [
  '#2563EB', '#DC2626', '#059669', '#D97706', '#7C3AED',
  '#0891B2', '#DB2777', '#65A30D', '#EA580C'
];

/** Check if a value is within limits, return true if within range */
export function isInLimits(value: number, limits?: { min: number; max: number }): boolean {
  if (!limits) return true;
  return value >= limits.min && value <= limits.max;
}
