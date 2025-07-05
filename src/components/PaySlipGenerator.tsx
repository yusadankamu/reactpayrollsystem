import { useState } from "react";
import {
  Download,
  Send,
  FileText,
  Phone,
  MapPin,
  Clock,
  Gift,
} from "lucide-react";
import { employees } from "../data/employees";
import {
  calculatePayroll,
  formatCurrency,
  formatDate,
  getCurrentPeriod,
  getActiveHolidayForPeriod,
  getHolidayName,
} from "../utils/payroll";
import { generatePDF } from "../utils/pdfGenerator";

const PaySlipGenerator: React.FC = () => {
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [selectedPeriod, setSelectedPeriod] = useState(getCurrentPeriod());
  const [overtimeHours, setOvertimeHours] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);

  const employee = employees.find((emp) => emp.id === selectedEmployee);
  const payslip = employee
    ? calculatePayroll(employee, selectedPeriod, overtimeHours)
    : null;
  const activeHoliday = getActiveHolidayForPeriod(selectedPeriod);

  const handleDownloadPDF = async () => {
    if (!payslip) return;

    setIsGenerating(true);
    try {
      await generatePDF(payslip);
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSendWhatsApp = () => {
    if (!employee || !payslip) return;

    const message = `🌊 *ENJOY DIVE PAYROLL*\n\nHello ${
      employee.name
    },\n\nYour pay slip for ${selectedPeriod} is ready!\n\n💰 Net Salary: ${formatCurrency(
      payslip.netSalary
    )}\n\nThank you for your dedication to Enjoy Dive! 🏊‍♂️`;
    const whatsappUrl = `https://wa.me/${employee.phone.replace(
      /\D/g,
      ""
    )}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <div className="p-6 lg:p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
            Pay Slip Generator
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-lg mt-2">
            Generate and send pay slips to employees
          </p>
        </div>
      </div>

      {/* Holiday Alert */}
      {activeHoliday && (
        <div className="bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-6">
          <div className="flex items-center space-x-4">
            <div className="bg-emerald-600 p-3 rounded-xl">
              <Gift className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-emerald-800 dark:text-emerald-400">
                {activeHoliday.name}
              </h3>
              <p className="text-emerald-700 dark:text-emerald-300 mt-1">
                {activeHoliday.description} - Tunjangan otomatis akan
                ditambahkan ({activeHoliday.allowanceMultiplier * 100}% dari
                gaji pokok)
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Selection Controls */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-lg border border-slate-200 dark:border-slate-700">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div>
            <label className="block text-base font-semibold text-slate-700 dark:text-slate-300 mb-3">
              Select Employee
            </label>
            <select
              value={selectedEmployee}
              onChange={(e) => setSelectedEmployee(e.target.value)}
              className="w-full px-4 py-4 border border-slate-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-slate-500 focus:border-transparent text-base"
            >
              <option value="">Choose an employee...</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.name} - {emp.position}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-base font-semibold text-slate-700 dark:text-slate-300 mb-3">
              Pay Period
            </label>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="w-full px-4 py-4 border border-slate-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-slate-500 focus:border-transparent text-base"
            >
              <option value={getCurrentPeriod()}>{getCurrentPeriod()}</option>
              <option value="12/2024">12/2024</option>
              <option value="11/2024">11/2024</option>
              <option value="10/2024">10/2024</option>
              <option value="9/2024">9/2024</option>
              <option value="4/2024">4/2024 (Idul Fitri)</option>
              <option value="3/2024">3/2024 (Nyepi)</option>
              <option value="1/2024">1/2024 (Anniversary)</option>
            </select>
          </div>

          <div>
            <label className="block text-base font-semibold text-slate-700 dark:text-slate-300 mb-3">
              Overtime Hours
            </label>
            <div className="relative">
              <Clock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="number"
                min="0"
                max="100"
                value={overtimeHours}
                onChange={(e) =>
                  setOvertimeHours(parseInt(e.target.value) || 0)
                }
                className="w-full pl-12 pr-4 py-4 border border-slate-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-slate-500 focus:border-transparent text-base"
                placeholder="0"
              />
            </div>
            {employee?.overtimeRate && (
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                Rate: {formatCurrency(employee.overtimeRate)}/hour
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Pay Slip Preview */}
      {payslip && employee && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="p-10" id="payslip-content">
            {/* Header */}
            <div className="bg-gradient-to-r from-slate-900 to-slate-700 text-white p-8 rounded-2xl mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold mb-3">ENJOY DIVE</h1>
                  <p className="text-slate-300 text-lg">
                    Premier Diving Center in Bali
                  </p>
                  <div className="flex items-center space-x-6 mt-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4" />
                      <span>Sanur Beach, Bali</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4" />
                      <span>+62 361 288 829</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="bg-white/20 backdrop-blur-sm p-4 rounded-xl">
                    <FileText className="h-10 w-10 mb-3" />
                    <p className="text-sm font-semibold">PAY SLIP</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Holiday Banner */}
            {payslip.holidayType && (
              <div className="bg-gradient-to-r from-emerald-500 to-green-500 text-white p-6 rounded-xl mb-8">
                <div className="flex items-center space-x-4">
                  <Gift className="h-8 w-8" />
                  <div>
                    <h3 className="text-xl font-bold">
                      {getHolidayName(payslip.holidayType)}
                    </h3>
                    <p className="text-emerald-100">
                      Selamat hari raya! Tunjangan khusus telah ditambahkan.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Employee Info */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
                  Employee Information
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between py-2">
                    <span className="text-slate-600 dark:text-slate-400 font-medium">
                      Employee ID:
                    </span>
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {employee.id}
                    </span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-slate-600 dark:text-slate-400 font-medium">
                      Name:
                    </span>
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {employee.name}
                    </span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-slate-600 dark:text-slate-400 font-medium">
                      Position:
                    </span>
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {employee.position}
                    </span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-slate-600 dark:text-slate-400 font-medium">
                      Department:
                    </span>
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {employee.department}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
                  Pay Period
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between py-2">
                    <span className="text-slate-600 dark:text-slate-400 font-medium">
                      Period:
                    </span>
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {selectedPeriod}
                    </span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-slate-600 dark:text-slate-400 font-medium">
                      Generated:
                    </span>
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {formatDate(new Date().toISOString())}
                    </span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-slate-600 dark:text-slate-400 font-medium">
                      Bank Account:
                    </span>
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {employee.bankAccount}
                    </span>
                  </div>
                  {overtimeHours > 0 && (
                    <div className="flex justify-between py-2">
                      <span className="text-slate-600 dark:text-slate-400 font-medium">
                        Overtime Hours:
                      </span>
                      <span className="font-semibold text-slate-900 dark:text-white">
                        {overtimeHours} hours
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Salary Breakdown */}
            <div className="border-t border-slate-200 dark:border-slate-700 pt-8">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-8">
                Salary Breakdown
              </h3>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Earnings */}
                <div className="bg-emerald-50 dark:bg-emerald-900/20 p-6 rounded-xl border border-emerald-200 dark:border-emerald-800">
                  <h4 className="font-bold text-emerald-800 dark:text-emerald-400 mb-6 text-lg">
                    Earnings
                  </h4>
                  <div className="space-y-4">
                    <div className="flex justify-between py-2">
                      <span className="text-slate-700 dark:text-slate-300 font-medium">
                        Base Salary
                      </span>
                      <span className="font-bold text-slate-900 dark:text-white">
                        {formatCurrency(payslip.baseSalary)}
                      </span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="text-slate-700 dark:text-slate-300 font-medium">
                        Transport Allowance
                      </span>
                      <span className="font-bold text-slate-900 dark:text-white">
                        {formatCurrency(payslip.allowances.transport)}
                      </span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="text-slate-700 dark:text-slate-300 font-medium">
                        Meal Allowance
                      </span>
                      <span className="font-bold text-slate-900 dark:text-white">
                        {formatCurrency(payslip.allowances.meal)}
                      </span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="text-slate-700 dark:text-slate-300 font-medium">
                        Bonus
                      </span>
                      <span className="font-bold text-slate-900 dark:text-white">
                        {formatCurrency(payslip.allowances.bonus)}
                      </span>
                    </div>
                    {payslip.allowances.overtime > 0 && (
                      <div className="flex justify-between py-2">
                        <span className="text-slate-700 dark:text-slate-300 font-medium">
                          Overtime Pay
                        </span>
                        <span className="font-bold text-slate-900 dark:text-white">
                          {formatCurrency(payslip.allowances.overtime)}
                        </span>
                      </div>
                    )}
                    {payslip.allowances.tips > 0 && (
                      <div className="flex justify-between py-2">
                        <span className="text-slate-700 dark:text-slate-300 font-medium">
                          Tips dari Tamu
                        </span>
                        <span className="font-bold text-slate-900 dark:text-white">
                          {formatCurrency(payslip.allowances.tips)}
                        </span>
                      </div>
                    )}
                    {payslip.allowances.holidayAllowance > 0 && (
                      <div className="flex justify-between py-2 bg-emerald-100 dark:bg-emerald-800/30 px-3 rounded-lg">
                        <span className="text-emerald-700 dark:text-emerald-300 font-medium">
                          {payslip.holidayType
                            ? getHolidayName(payslip.holidayType)
                            : "Tunjangan Hari Raya"}
                        </span>
                        <span className="font-bold text-emerald-800 dark:text-emerald-200">
                          {formatCurrency(payslip.allowances.holidayAllowance)}
                        </span>
                      </div>
                    )}
                    <div className="border-t border-emerald-200 dark:border-emerald-800 pt-4 mt-4">
                      <div className="flex justify-between font-bold text-lg">
                        <span className="text-emerald-800 dark:text-emerald-400">
                          Gross Salary
                        </span>
                        <span className="text-emerald-800 dark:text-emerald-400">
                          {formatCurrency(payslip.grossSalary)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Deductions */}
                <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-xl border border-red-200 dark:border-red-800">
                  <h4 className="font-bold text-red-800 dark:text-red-400 mb-6 text-lg">
                    Deductions
                  </h4>
                  <div className="space-y-4">
                    <div className="flex justify-between py-2">
                      <span className="text-slate-700 dark:text-slate-300 font-medium">
                        Tax
                      </span>
                      <span className="font-bold text-slate-900 dark:text-white">
                        {formatCurrency(payslip.deductions.tax)}
                      </span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="text-slate-700 dark:text-slate-300 font-medium">
                        Insurance
                      </span>
                      <span className="font-bold text-slate-900 dark:text-white">
                        {formatCurrency(payslip.deductions.insurance)}
                      </span>
                    </div>
                    {payslip.deductions.cooperativeFund > 0 && (
                      <div className="flex justify-between py-2">
                        <span className="text-slate-700 dark:text-slate-300 font-medium">
                          Dana Koperasi
                        </span>
                        <span className="font-bold text-slate-900 dark:text-white">
                          {formatCurrency(payslip.deductions.cooperativeFund)}
                        </span>
                      </div>
                    )}
                    {payslip.deductions.healthInsurance > 0 && (
                      <div className="flex justify-between py-2">
                        <span className="text-slate-700 dark:text-slate-300 font-medium">
                          Asuransi Kesehatan
                        </span>
                        <span className="font-bold text-slate-900 dark:text-white">
                          {formatCurrency(payslip.deductions.healthInsurance)}
                        </span>
                      </div>
                    )}
                    {payslip.deductions.loanDeduction > 0 && (
                      <div className="flex justify-between py-2">
                        <span className="text-slate-700 dark:text-slate-300 font-medium">
                          Potongan Kasbon
                        </span>
                        <span className="font-bold text-slate-900 dark:text-white">
                          {formatCurrency(payslip.deductions.loanDeduction)}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between py-2 bg-red-100 dark:bg-red-800/30 px-3 rounded-lg">
                      <span className="text-red-700 dark:text-red-300 font-medium">
                        PPN (11%)
                      </span>
                      <span className="font-bold text-red-800 dark:text-red-200">
                        {formatCurrency(payslip.deductions.ppn)}
                      </span>
                    </div>
                    {payslip.deductions.other > 0 && (
                      <div className="flex justify-between py-2">
                        <span className="text-slate-700 dark:text-slate-300 font-medium">
                          Other
                        </span>
                        <span className="font-bold text-slate-900 dark:text-white">
                          {formatCurrency(payslip.deductions.other)}
                        </span>
                      </div>
                    )}
                    <div className="border-t border-red-200 dark:border-red-800 pt-4 mt-4">
                      <div className="flex justify-between font-bold text-lg">
                        <span className="text-red-800 dark:text-red-400">
                          Total Deductions
                        </span>
                        <span className="text-red-800 dark:text-red-400">
                          {formatCurrency(payslip.deductions.total)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Net Salary */}
              <div className="mt-8 bg-gradient-to-r from-slate-900 to-slate-700 text-white p-8 rounded-2xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xl font-bold mb-2">Net Salary</h4>
                    <p className="text-slate-300">Amount to be paid</p>
                  </div>
                  <div className="text-right">
                    <p className="text-4xl font-bold">
                      {formatCurrency(payslip.netSalary)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-10 pt-8 border-t border-slate-200 dark:border-slate-700 text-center">
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                This is a computer-generated pay slip. No signature required.
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                For queries, contact HR at hr@enjoydive.com
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="bg-slate-50 dark:bg-slate-700 px-10 py-6 flex items-center justify-between border-t border-slate-200 dark:border-slate-600">
            <div className="text-sm text-slate-600 dark:text-slate-400 font-medium">
              Pay slip ID: {payslip.id}
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleDownloadPDF}
                disabled={isGenerating}
                className="bg-slate-600 hover:bg-slate-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center space-x-2 disabled:opacity-50"
              >
                {isGenerating ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                ) : (
                  <Download className="h-4 w-4" />
                )}
                <span>{isGenerating ? "Generating..." : "Download PDF"}</span>
              </button>
              <button
                onClick={handleSendWhatsApp}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center space-x-2"
              >
                <Send className="h-4 w-4" />
                <span>Send WhatsApp</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {!selectedEmployee && (
        <div className="text-center py-20">
          <div className="bg-slate-100 dark:bg-slate-800 rounded-full p-12 w-40 h-40 mx-auto mb-6 flex items-center justify-center">
            <FileText className="h-16 w-16 text-slate-400" />
          </div>
          <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
            Select an Employee
          </h3>
          <p className="text-slate-500 dark:text-slate-400">
            Choose an employee to generate their pay slip
          </p>
        </div>
      )}
    </div>
  );
};

export default PaySlipGenerator;
