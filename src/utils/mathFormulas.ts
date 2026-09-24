import { TheoreticalMetrics, KendallModelType } from '../types/queue';

/**
 * Calculates factorial n!
 */
export function factorial(n: number): number {
  if (n <= 1) return 1;
  let res = 1;
  for (let i = 2; i <= n; i++) {
    res *= i;
  }
  return res;
}

/**
 * Calculates steady-state metrics for M/M/1 Queue
 * Arrival: Poisson (rate lambda)
 * Service: Exponential (rate mu)
 * Servers: 1
 * Capacity: Infinite
 */
export function calculateMM1(lambda: number, mu: number): TheoreticalMetrics {
  const rho = lambda / mu;
  const isStable = rho < 1;

  if (!isStable) {
    return {
      rho,
      isStable: false,
      P0: 0,
      Lq: Infinity,
      L: Infinity,
      Wq: Infinity,
      W: Infinity,
      P_wait: 1,
    };
  }

  const P0 = 1 - rho;
  const L = rho / (1 - rho);
  const Lq = (rho * rho) / (1 - rho);
  const W = 1 / (mu - lambda); // in same time unit as lambda & mu
  const Wq = lambda / (mu * (mu - lambda));
  const P_wait = rho;

  return {
    rho,
    isStable: true,
    P0,
    Lq,
    L,
    Wq,
    W,
    P_wait,
  };
}

/**
 * Calculates steady-state metrics for M/M/c (Erlang-C) Queue
 * Arrival: Poisson (lambda)
 * Service: Exponential (mu per server)
 * Servers: c
 * Capacity: Infinite
 */
export function calculateMMC(lambda: number, mu: number, c: number): TheoreticalMetrics {
  const r = lambda / mu; // traffic load in Erlangs
  const rho = lambda / (c * mu); // utilization per server
  const isStable = rho < 1;

  if (!isStable) {
    return {
      rho,
      isStable: false,
      P0: 0,
      Lq: Infinity,
      L: Infinity,
      Wq: Infinity,
      W: Infinity,
      P_wait: 1,
    };
  }

  // Calculate P0 = [sum_{n=0}^{c-1} (r^n / n!) + (r^c / (c! * (1 - rho)))]^(-1)
  let sum = 0;
  for (let n = 0; n < c; n++) {
    sum += Math.pow(r, n) / factorial(n);
  }
  const lastTerm = Math.pow(r, c) / (factorial(c) * (1 - rho));
  const P0 = 1 / (sum + lastTerm);

  // Erlang C formula (Probability that an arriving customer has to wait)
  // P_wait = (r^c / c!) * (1 / (1 - rho)) * P0
  const P_wait = lastTerm * P0;

  // Average queue length Lq
  // Lq = P_wait * (rho / (1 - rho))
  const Lq = (P_wait * rho) / (1 - rho);

  // Average number in system L = Lq + r
  const L = Lq + r;

  // Average waiting time in queue Wq = Lq / lambda
  const Wq = Lq / lambda;

  // Average time in system W = Wq + 1 / mu
  const W = Wq + 1 / mu;

  return {
    rho,
    isStable: true,
    P0,
    Lq,
    L,
    Wq,
    W,
    P_wait,
  };
}

/**
 * Calculates steady-state metrics for M/M/1/K Queue
 * Arrival: Poisson (lambda)
 * Service: Exponential (mu)
 * Servers: 1
 * Capacity: K (Max K entities allowed in system: 1 in service + K-1 in queue)
 * Always stable because capacity is finite!
 */
export function calculateMM1K(lambda: number, mu: number, K: number): TheoreticalMetrics {
  const rho = lambda / mu;
  let P0 = 0;
  let PK = 0;
  let L = 0;

  if (Math.abs(rho - 1) < 1e-6) {
    // When rho == 1
    P0 = 1 / (K + 1);
    PK = P0;
    L = K / 2;
  } else {
    // rho != 1
    P0 = (1 - rho) / (1 - Math.pow(rho, K + 1));
    PK = P0 * Math.pow(rho, K);
    const numerator = rho * (1 - (K + 1) * Math.pow(rho, K) + K * Math.pow(rho, K + 1));
    const denominator = (1 - rho) * (1 - Math.pow(rho, K + 1));
    L = numerator / denominator;
  }

  // Effective arrival rate lambda_eff = lambda * (1 - PK)
  const lambdaEff = lambda * (1 - PK);

  // Average number in queue Lq = L - (1 - P0)
  const Lq = Math.max(0, L - (1 - P0));

  // By Little's Law for effective arrival:
  const W = lambdaEff > 0 ? L / lambdaEff : 0;
  const Wq = lambdaEff > 0 ? Lq / lambdaEff : 0;

  return {
    rho,
    isStable: true,
    P0,
    Lq,
    L,
    Wq,
    W,
    P_loss: PK,
    lambdaEff,
  };
}

/**
 * Calculates steady-state metrics for M/G/1 Queue (Pollaczek-Khinchine Formula)
 * Arrival: Poisson (lambda)
 * Service: General distribution with mean 1/mu and variance sigma^2
 * Servers: 1
 * Capacity: Infinite
 */
export function calculateMG1(lambda: number, mu: number, sigma: number): TheoreticalMetrics {
  const rho = lambda / mu;
  const isStable = rho < 1;

  if (!isStable) {
    return {
      rho,
      isStable: false,
      P0: 0,
      Lq: Infinity,
      L: Infinity,
      Wq: Infinity,
      W: Infinity,
      P_wait: 1,
    };
  }

  const P0 = 1 - rho;
  // Pollaczek-Khinchine: Lq = (lambda^2 * sigma^2 + rho^2) / (2 * (1 - rho))
  const variance = sigma * sigma;
  const Lq = (lambda * lambda * variance + rho * rho) / (2 * (1 - rho));
  const L = Lq + rho;
  const Wq = Lq / lambda;
  const W = Wq + 1 / mu;

  return {
    rho,
    isStable: true,
    P0,
    Lq,
    L,
    Wq,
    W,
  };
}

export interface StepExplanation {
  stepNumber: number;
  stageName: string;
  description: string;
  latexFormula: string;
  numericalResult: string;
  explanation: string;
}

/**
 * Returns detailed step-by-step breakdown for any selected model
 */
export function getStepByStepCalculation(
  model: KendallModelType,
  lambda: number,
  mu: number,
  c: number = 1,
  K: number = 10,
  sigma: number = 0
): StepExplanation[] {
  const steps: StepExplanation[] = [];

  if (model === 'M/M/1') {
    const rho = lambda / mu;
    const isStable = rho < 1;

    steps.push({
      stepNumber: 1,
      stageName: 'Giai đoạn 1: Hệ số sử dụng kênh (Traffic Intensity)',
      description: 'Đo lường mức độ bận rộn của người phục vụ duy nhất trong hệ thống.',
      latexFormula: '\\rho = \\frac{\\lambda}{\\mu} = \\frac{' + lambda + '}{' + mu + '}',
      numericalResult: `\\rho = ${rho.toFixed(4)} ${isStable ? '(Ổn định < 1)' : '(CẢNH BÁO: Tắc nghẽn ≥ 1)'}`,
      explanation: isStable
        ? `Kênh phục vụ bận rộn ${(rho * 100).toFixed(1)}% thời gian, rảnh rỗi ${((1 - rho) * 100).toFixed(1)}% thời gian.`
        : `Tốc độ khách đến vượt quá tốc độ phục vụ! Hàng chờ sẽ tăng dần đến vô tận.`,
    });

    if (isStable) {
      const P0 = 1 - rho;
      steps.push({
        stepNumber: 2,
        stageName: 'Giai đoạn 2: Xác suất hệ thống rảnh rỗi (Idle State)',
        description: 'Xác suất tại một thời điểm ngẫu nhiên không có bất kỳ khách hàng nào.',
        latexFormula: 'P_0 = 1 - \\rho = 1 - ' + rho.toFixed(4),
        numericalResult: `P_0 = ${P0.toFixed(4)} \\text{ (${(P0 * 100).toFixed(2)}\\%)}`,
        explanation: `Khả năng khách hàng vừa đến là được phục vụ ngay lập tức mà không cần xếp hàng.`,
      });

      const Lq = (rho * rho) / (1 - rho);
      const L = rho / (1 - rho);
      steps.push({
        stepNumber: 3,
        stageName: 'Giai đoạn 3: Số lượng khách trung bình (Lq và L)',
        description: 'Độ dài trung bình của hàng đợi xếp hàng và tổng số người có mặt trong hệ thống.',
        latexFormula: 'L_q = \\frac{\\rho^2}{1-\\rho} = \\frac{' + (rho * rho).toFixed(4) + '}{' + (1 - rho).toFixed(4) + '}, \\quad L = \\frac{\\rho}{1-\\rho} = L_q + \\rho',
        numericalResult: `L_q = ${Lq.toFixed(2)} \\text{ khách trong hàng}, \\quad L = ${L.toFixed(2)} \\text{ khách trong hệ thống}`,
        explanation: `Trung bình có ${Lq.toFixed(2)} người đang đứng xếp hàng chờ và ${L.toFixed(2)} người đang ở cửa hàng.`,
      });

      const Wq = Lq / lambda;
      const W = Wq + 1 / mu;
      steps.push({
        stepNumber: 4,
        stageName: 'Giai đoạn 4: Thời gian chờ trung bình (Định luật Little)',
        description: 'Ứng dụng định luật Little: L = \\lambda W và L_q = \\lambda W_q.',
        latexFormula: 'W_q = \\frac{L_q}{\\lambda} = \\frac{1}{\\mu - \\lambda} - \\frac{1}{\\mu}, \\quad W = W_q + \\frac{1}{\\mu} = \\frac{1}{\\mu - \\lambda}',
        numericalResult: `W_q = ${Wq.toFixed(3)} \\text{ phút} = ${(Wq * 60).toFixed(1)}s, \\quad W = ${W.toFixed(3)} \\text{ phút} = ${(W * 60).toFixed(1)}s`,
        explanation: `Một khách hàng trung bình phải đợi ${(Wq * 60).toFixed(1)} giây trong hàng và mất tổng cộng ${(W * 60).toFixed(1)} giây cho toàn bộ quy trình.`,
      });
    }
  } else if (model === 'M/M/c') {
    const r = lambda / mu;
    const rho = lambda / (c * mu);
    const isStable = rho < 1;

    steps.push({
      stepNumber: 1,
      stageName: 'Giai đoạn 1: Tải lượng giao thông & Hệ số sử dụng trung bình mỗi kênh',
      description: 'Tính lượng tải công việc r (Erlangs) và hiệu suất khai thác mỗi quầy phục vụ.',
      latexFormula: 'r = \\frac{\\lambda}{\\mu} = ' + r.toFixed(2) + ', \\quad \\rho = \\frac{\\lambda}{c\\mu} = \\frac{' + lambda + '}{' + c + ' \\times ' + mu + '}',
      numericalResult: `r = ${r.toFixed(2)} \\text{ Erlangs}, \\quad \\rho = ${rho.toFixed(4)} ${isStable ? '(< 1, Hệ thống ổn định)' : '(≥ 1, Quá tải)'}`,
      explanation: isStable
        ? `Với ${c} quầy song song, trung bình mỗi quầy làm việc ${(rho * 100).toFixed(1)}% công suất.`
        : `Công suất phục vụ không đủ! Cần ít nhất ${Math.ceil(r)} quầy để hệ thống không bị vỡ.`,
    });

    if (isStable) {
      let sum = 0;
      for (let n = 0; n < c; n++) {
        sum += Math.pow(r, n) / factorial(n);
      }
      const lastTerm = Math.pow(r, c) / (factorial(c) * (1 - rho));
      const P0 = 1 / (sum + lastTerm);
      const P_wait = lastTerm * P0;

      steps.push({
        stepNumber: 2,
        stageName: 'Giai đoạn 2: Xác suất rảnh P0 và Công thức Erlang-C (P_wait)',
        description: 'Tính xác suất toàn bộ c quầy đều rảnh và xác suất khách đến phải xếp hàng chờ đợi.',
        latexFormula: 'P_0 = \\left[ \\sum_{n=0}^{c-1} \\frac{r^n}{n!} + \\frac{r^c}{c!(1-\\rho)} \\right]^{-1}, \\quad P(W_q > 0) = C(c, r) = \\frac{r^c}{c!(1-\\rho)} P_0',
        numericalResult: `P_0 = ${P0.toFixed(4)} \\text{ (${(P0 * 100).toFixed(2)}\\%)}, \\quad P(W_q > 0) = ${P_wait.toFixed(4)} \\text{ (${(P_wait * 100).toFixed(2)}\\%)}`,
        explanation: `Có ${(P0 * 100).toFixed(2)}% khả năng tất cả các quầy đều không có khách. Tỉ lệ khách phải chờ là ${(P_wait * 100).toFixed(2)}%.`,
      });

      const Lq = (P_wait * rho) / (1 - rho);
      const L = Lq + r;
      const Wq = Lq / lambda;
      const W = Wq + 1 / mu;

      steps.push({
        stepNumber: 3,
        stageName: 'Giai đoạn 3: Độ dài hàng và Thời gian chờ đa kênh',
        description: 'Sử dụng công thức Erlang-C kết hợp Định luật Little.',
        latexFormula: 'L_q = \\frac{C(c, r) \\cdot \\rho}{1-\\rho}, \\quad L = L_q + \\frac{\\lambda}{\\mu}, \\quad W_q = \\frac{L_q}{\\lambda}, \\quad W = W_q + \\frac{1}{\\mu}',
        numericalResult: `L_q = ${Lq.toFixed(2)} \\text{ khách}, \\quad W_q = ${(Wq * 60).toFixed(1)} \\text{ giây}, \\quad W = ${(W * 60).toFixed(1)} \\text{ giây}`,
        explanation: `Trung bình hàng chờ chỉ có ${Lq.toFixed(2)} người và thời gian chờ chỉ là ${(Wq * 60).toFixed(1)} giây trước khi được một trong ${c} quầy tiếp nhận.`,
      });
    }
  } else if (model === 'M/M/1/K') {
    const rho = lambda / mu;
    let P0 = 0;
    let PK = 0;
    let L = 0;

    if (Math.abs(rho - 1) < 1e-6) {
      P0 = 1 / (K + 1);
      PK = P0;
      L = K / 2;
    } else {
      P0 = (1 - rho) / (1 - Math.pow(rho, K + 1));
      PK = P0 * Math.pow(rho, K);
      const num = rho * (1 - (K + 1) * Math.pow(rho, K) + K * Math.pow(rho, K + 1));
      const den = (1 - rho) * (1 - Math.pow(rho, K + 1));
      L = num / den;
    }

    const lambdaEff = lambda * (1 - PK);
    const Lq = Math.max(0, L - (1 - P0));
    const W = lambdaEff > 0 ? L / lambdaEff : 0;
    const Wq = lambdaEff > 0 ? Lq / lambdaEff : 0;

    steps.push({
      stepNumber: 1,
      stageName: 'Giai đoạn 1: Xác suất đầy hàng và Tỷ lệ mất khách (Blocking Probability)',
      description: 'Hệ thống có dung lượng tối đa K = ' + K + ' người. Khi đã đủ K, khách mới đến sẽ bị từ chối (Balk/Drop).',
      latexFormula: 'P_K = P_0 \\cdot \\rho^K = \\frac{(1-\\rho)\\rho^K}{1-\\rho^{K+1}}',
      numericalResult: `P_K = ${PK.toFixed(4)} \\text{ (${(PK * 100).toFixed(2)}\\% khách bị từ chối)}`,
      explanation: `Khoảng ${(PK * 100).toFixed(2)}% khách hàng đến gặp tình trạng hàng đầy và phải bỏ đi (mất doanh thu).`,
    });

    steps.push({
      stepNumber: 2,
      stageName: 'Giai đoạn 2: Tốc độ dòng vào thực tế (Effective Arrival Rate)',
      description: 'Chỉ những khách được nhận vào hệ thống mới tham gia tạo hàng đợi.',
      latexFormula: '\\lambda_{\\text{eff}} = \\lambda (1 - P_K) = ' + lambda + ' \\times (1 - ' + PK.toFixed(4) + ')',
      numericalResult: `\\lambda_{\\text{eff}} = ${lambdaEff.toFixed(2)} \\text{ khách/phút (trên tổng số ${lambda} khách đến)}`,
      explanation: `Dù có ${lambda} khách đến mỗi phút, hệ thống chỉ phục vụ được ${lambdaEff.toFixed(2)} khách, còn lại bị nghẽn.`,
    });

    steps.push({
      stepNumber: 3,
      stageName: 'Giai đoạn 3: Số khách và thời gian chờ trong hệ thống giới hạn',
      description: 'Tính toán L, Lq và W, Wq theo tốc độ hiệu dụng lambda_eff.',
      latexFormula: 'W = \\frac{L}{\\lambda_{\\text{eff}}}, \\quad W_q = \\frac{L_q}{\\lambda_{\\text{eff}}}',
      numericalResult: `L = ${L.toFixed(2)} \\text{ khách}, \\quad L_q = ${Lq.toFixed(2)} \\text{ khách}, \\quad W_q = ${(Wq * 60).toFixed(1)}s`,
      explanation: `Hàng đợi không bao giờ vượt quá ${K - 1} người chờ vì dung lượng đã bị chặn ở mức K = ${K}.`,
    });
  } else if (model === 'M/G/1') {
    const rho = lambda / mu;
    const isStable = rho < 1;
    const variance = sigma * sigma;

    steps.push({
      stepNumber: 1,
      stageName: 'Giai đoạn 1: Phân tích phân phối thời gian phục vụ tổng quát G',
      description: 'Thời gian phục vụ không nhất thiết phải là hàm mũ. Ta có giá trị kỳ vọng E[S] = 1/mu và phương sai Var(S) = sigma^2.',
      latexFormula: 'E[S] = \\frac{1}{\\mu} = ' + (1 / mu).toFixed(3) + ', \\quad \\text{Var}(S) = \\sigma^2 = ' + variance.toFixed(4),
      numericalResult: `\\rho = \\frac{\\lambda}{\\mu} = ${rho.toFixed(4)}`,
      explanation: variance === 0
        ? `Trường hợp đặc biệt: Thời gian phục vụ cố định hoàn toàn M/D/1 (Deterministic)!`
        : `Thời gian phục vụ có độ dao động lệch chuẩn là ${sigma.toFixed(3)} đơn vị.`,
    });

    if (isStable) {
      const Lq = (lambda * lambda * variance + rho * rho) / (2 * (1 - rho));
      const L = Lq + rho;
      const Wq = Lq / lambda;
      const W = Wq + 1 / mu;

      steps.push({
        stepNumber: 2,
        stageName: 'Giai đoạn 2: Định lý Pollaczek-Khinchine (P-K Formula)',
        description: 'Công thức kinh điển liên hệ giữa phương sai thời gian phục vụ và độ dài hàng đợi.',
        latexFormula: 'L_q = \\frac{\\lambda^2 \\sigma^2 + \\rho^2}{2(1 - \\rho)}',
        numericalResult: `L_q = ${Lq.toFixed(2)} \\text{ khách}`,
        explanation: variance === 0
          ? `So với mô hình M/M/1 (sigma^2 = 1/mu^2), mô hình M/D/1 giảm đúng 50% độ dài hàng chờ và thời gian chờ!`
          : `Phương sai của dịch vụ càng lớn thì hàng chờ càng dài, dù tốc độ trung bình không đổi!`,
      });

      steps.push({
        stepNumber: 3,
        stageName: 'Giai đoạn 3: Thời gian lưu chuyển trong hệ thống M/G/1',
        description: 'Tính thời gian chờ đợi Wq và thời gian trong hệ thống W.',
        latexFormula: 'W_q = \\frac{L_q}{\\lambda}, \\quad W = W_q + \\frac{1}{\\mu}',
        numericalResult: `W_q = ${(Wq * 60).toFixed(1)} \\text{ giây}, \\quad W = ${(W * 60).toFixed(1)} \\text{ giây}`,
        explanation: `Chuẩn hóa quy trình làm việc (giảm sigma) là cách hiệu quả nhất để giảm thời gian chờ mà không cần tuyển thêm nhân viên.`,
      });
    }
  }

  return steps;
}

export interface CostOptimizationResult {
  servers: number;
  utilization: number;
  Lq: number;
  L: number;
  Wq: number;
  costService: number;
  costWaiting: number;
  totalCost: number;
  isOptimal: boolean;
}

/**
 * Calculates optimal number of servers to minimize Total Cost:
 * TC(c) = Cs * c + Cw * L (or Lq)
 */
export function calculateOptimalServers(
  lambda: number,
  mu: number,
  costPerServerHour: number,
  costPerWaitingHour: number,
  maxServers: number = 8
): CostOptimizationResult[] {
  const results: CostOptimizationResult[] = [];
  const minRequiredServers = Math.floor(lambda / mu) + 1;

  let minTotalCost = Infinity;
  let bestC = minRequiredServers;

  for (let c = minRequiredServers; c <= Math.max(minRequiredServers + 4, maxServers); c++) {
    const metrics = calculateMMC(lambda, mu, c);
    if (!metrics.isStable) continue;

    const costService = c * costPerServerHour;
    // lambda and mu in customers/hour (or /min scaled to hour)
    const costWaiting = metrics.L * costPerWaitingHour;
    const totalCost = costService + costWaiting;

    if (totalCost < minTotalCost) {
      minTotalCost = totalCost;
      bestC = c;
    }

    results.push({
      servers: c,
      utilization: metrics.rho,
      Lq: metrics.Lq,
      L: metrics.L,
      Wq: metrics.Wq,
      costService,
      costWaiting,
      totalCost,
      isOptimal: false,
    });
  }

  return results.map((r) => ({
    ...r,
    isOptimal: r.servers === bestC,
  }));
}
