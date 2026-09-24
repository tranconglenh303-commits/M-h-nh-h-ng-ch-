export type QueueDiscipline = 'FIFO' | 'LIFO' | 'Priority' | 'Random';
export type ServiceDistribution = 'exponential' | 'deterministic' | 'erlang';
export type KendallModelType = 'M/M/1' | 'M/M/c' | 'M/M/1/K' | 'M/G/1';

export interface Customer {
  id: number;
  name: string;
  arriveTime: number; // in simulated seconds
  serviceStartTime?: number;
  serviceEndTime?: number;
  serviceTimeNeeded: number; // in seconds
  waitTime: number; // waiting in queue before service
  priority: number; // 1 = regular, 2 = VIP / urgent
  status: 'waiting' | 'in_service' | 'completed' | 'balked';
  assignedServerId?: number;
  color: string;
  avatar: string;
}

export interface ServerChannel {
  id: number;
  name: string;
  isBusy: boolean;
  currentCustomerId?: number;
  busyRemainingSeconds: number;
  totalServiceDuration: number;
  totalCustomersServed: number;
}

export interface SimulatorConfig {
  lambda: number; // Arrival rate (customers per minute)
  mu: number; // Service rate per server (customers per minute)
  c: number; // Number of servers (1 - 8)
  capacity: number | null; // Max queue capacity (null = infinite)
  discipline: QueueDiscipline;
  serviceDistribution: ServiceDistribution;
  balkingThreshold: number; // If queue length > this, customer might leave (0 = no balking)
  speed: number; // Simulation playback speed multiplier (0.5x, 1x, 2x, 5x)
}

export interface TheoreticalMetrics {
  rho: number; // Traffic intensity / utilization
  isStable: boolean;
  P0: number; // Probability of 0 customers in system
  Lq: number; // Avg customers in queue
  L: number; // Avg customers in system
  Wq: number; // Avg wait time in queue (minutes & seconds)
  W: number; // Avg time in system (minutes & seconds)
  P_wait?: number; // Probability customer must wait (Erlang C)
  P_loss?: number; // Probability of customer drop (for finite capacity)
  lambdaEff?: number; // Effective arrival rate
}

export interface SimulationStats {
  simulatedTimeSeconds: number;
  totalArrived: number;
  totalServed: number;
  totalBalked: number;
  currentQueueLength: number;
  currentInService: number;
  avgWaitTimeSeconds: number;
  avgSystemTimeSeconds: number;
  serverUtilization: number;
}

export interface ApplicationPreset {
  id: string;
  title: string;
  tag: string;
  subtitle: string;
  description: string;
  model: KendallModelType;
  config: SimulatorConfig;
  metricsExpl: {
    realWorldArrival: string;
    realWorldService: string;
    keyTakeaway: string;
  };
}
