export interface Employee {
  id: string;
  name: string;
  position: string;
  department: string;
  email: string;
  phone: string;
  baseSalary: number;
  allowances: {
    transport: number;
    meal: number;
    bonus: number;
    overtime: number;
    tips: number;
    holidayAllowance: number;
  };
  deductions: {
    tax: number;
    insurance: number;
    other: number;
    cooperativeFund: number;
    healthInsurance: number;
    loanDeduction: number;
    ppn: number;
  };
  bankAccount: string;
  joinDate: string;
  status: "active" | "inactive";
  overtimeRate?: number; // per hour
  religion: "islam" | "kristen" | "katolik" | "hindu" | "budha" | "other";
  isManagement: boolean; // untuk menentukan apakah dapat tips atau tidak
  holidaySettings?: {
    idul_fitri: boolean;
    natal: boolean;
    nyepi: boolean;
    waisak: boolean;
    anniversary_bonus: boolean;
  };
}

export interface PayrollEntry {
  id: string;
  employeeId: string;
  period: string;
  baseSalary: number;
  allowances: number;
  deductions: number;
  netSalary: number;
  status: "pending" | "processed" | "sent";
  processedAt?: string;
  sentAt?: string;
}

export interface PaySlip {
  id: string;
  employeeId: string;
  employee: Employee;
  period: string;
  baseSalary: number;
  allowances: {
    transport: number;
    meal: number;
    bonus: number;
    overtime: number;
    tips: number;
    holidayAllowance: number;
    total: number;
  };
  deductions: {
    tax: number;
    insurance: number;
    other: number;
    cooperativeFund: number;
    healthInsurance: number;
    loanDeduction: number;
    ppn: number;
    total: number;
  };
  grossSalary: number;
  netSalary: number;
  generatedAt: string;
  overtimeHours?: number;
  holidayType?:
    | "idul_fitri"
    | "natal"
    | "nyepi"
    | "waisak"
    | "anniversary"
    | null;
}

export interface DashboardStats {
  totalEmployees: number;
  activeEmployees: number;
  totalPayroll: number;
  departmentStats: Record<string, number>;
  monthlyTrend: Array<{
    month: string;
    amount: number;
    employees: number;
  }>;
  payrollHistory: Array<{
    period: string;
    totalAmount: number;
    employeeCount: number;
    processedAt: string;
  }>;
}

export interface ReportData {
  period: string;
  type: "monthly" | "annual";
  totalPayroll: number;
  totalEmployees: number;
  departmentBreakdown: Array<{
    department: string;
    employeeCount: number;
    totalSalary: number;
    averageSalary: number;
  }>;
  salaryDistribution: Array<{
    range: string;
    count: number;
    percentage: number;
  }>;
  trends: Array<{
    period: string;
    amount: number;
    growth: number;
  }>;
  topEarners: Array<{
    name: string;
    position: string;
    department: string;
    salary: number;
  }>;
  generatedAt: string;
}

export interface HolidayCalendar {
  id: string;
  name: string;
  date: string;
  type: "idul_fitri" | "natal" | "nyepi" | "waisak" | "anniversary";
  description: string;
  allowanceMultiplier: number; // multiplier for base salary
  isActive: boolean;
  eligibleReligions: string[]; // agama yang berhak mendapat tunjangan
}
