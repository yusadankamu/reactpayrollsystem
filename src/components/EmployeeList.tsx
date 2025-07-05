import React, { useState } from "react";
import {
  Users,
  Search,
  Plus,
  Eye,
  Edit,
  Trash2,
  Mail,
  Phone,
  Calendar,
  Building,
  DollarSign,
  X,
  Save,
  AlertCircle,
  Star,
} from "lucide-react";
import { employees } from "../data/employees";
import { type Employee } from "../types";
import { formatCurrency, formatDate } from "../utils/payroll";

interface EmployeeModalProps {
  employee: Employee | null;
  isOpen: boolean;
  mode: "view" | "edit" | "add";
  onClose: () => void;
  onSave: (employee: Employee) => void;
  onDelete?: (employeeId: string) => void;
}

const EmployeeModal: React.FC<EmployeeModalProps> = ({
  employee,
  isOpen,
  mode,
  onClose,
  onSave,
  onDelete,
}) => {
  const [formData, setFormData] = useState<Employee>(
    employee || {
      id: "",
      name: "",
      position: "",
      department: "",
      email: "",
      phone: "",
      baseSalary: 0,
      allowances: {
        transport: 0,
        meal: 0,
        bonus: 0,
        overtime: 0,
        tips: 0,
        holidayAllowance: 0,
      },
      deductions: {
        tax: 0,
        insurance: 0,
        other: 0,
        cooperativeFund: 0,
        healthInsurance: 0,
        loanDeduction: 0,
        ppn: 0,
      },
      bankAccount: "",
      joinDate: new Date().toISOString().split("T")[0],
      status: "active",
      overtimeRate: 0,
      religion: "islam",
      isManagement: false,
      holidaySettings: {
        idul_fitri: false,
        natal: false,
        nyepi: false,
        waisak: false,
        anniversary_bonus: true,
      },
    }
  );

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const departments = [
    "Management",
    "Administration",
    "Marketing",
    "Purchasing",
    "Information Technology",
    "Equipment",
    "Diving Operations",
    "Transportation",
    "Cleaning Service",
  ];

  const positions = [
    "Chief Executive Officer",
    "Administrator",
    "Marketing Manager",
    "Marketing Executive",
    "Purchasing Manager",
    "Purchasing Staff",
    "IT Manager",
    "IT Support",
    "Equipment Manager",
    "Senior Diving Instructor",
    "Diving Instructor",
    "Senior Dive Master",
    "Dive Master",
    "Senior Driver",
    "Driver",
    "Cleaning Supervisor",
    "Cleaning Staff",
  ];

  const religions = [
    { value: "islam", label: "Islam" },
    { value: "kristen", label: "Kristen" },
    { value: "katolik", label: "Katolik" },
    { value: "hindu", label: "Hindu" },
    { value: "budha", label: "Budha" },
    { value: "other", label: "Lainnya" },
  ];

  const handleSave = () => {
    if (mode === "add") {
      const newId = `EMP${String(employees.length + 1).padStart(3, "0")}`;
      const newEmployee = { ...formData, id: newId };
      onSave(newEmployee);
    } else {
      onSave(formData);
    }
    onClose();
  };

  const handleDelete = () => {
    if (employee && onDelete) {
      onDelete(employee.id);
      setShowDeleteConfirm(false);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              {mode === "view"
                ? "Employee Details"
                : mode === "edit"
                ? "Edit Employee"
                : "Add New Employee"}
            </h2>
            {employee && (
              <p className="text-slate-600 dark:text-slate-400 mt-1">
                {employee.id} • {employee.position}
              </p>
            )}
          </div>
          <div className="flex items-center space-x-2">
            {mode === "view" && employee && onDelete && (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors"
            >
              <X className="h-5 w-5 text-slate-500" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Personal Information */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                Personal Information
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Full Name *
                  </label>
                  {mode === "view" ? (
                    <p className="text-slate-900 dark:text-white font-medium">
                      {formData.name}
                    </p>
                  ) : (
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-slate-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                      placeholder="Enter full name"
                    />
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Position *
                  </label>
                  {mode === "view" ? (
                    <p className="text-slate-900 dark:text-white font-medium">
                      {formData.position}
                    </p>
                  ) : (
                    <select
                      value={formData.position}
                      onChange={(e) =>
                        setFormData({ ...formData, position: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-slate-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                    >
                      <option value="">Select position</option>
                      {positions.map((pos) => (
                        <option key={pos} value={pos}>
                          {pos}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Department *
                  </label>
                  {mode === "view" ? (
                    <p className="text-slate-900 dark:text-white font-medium">
                      {formData.department}
                    </p>
                  ) : (
                    <select
                      value={formData.department}
                      onChange={(e) =>
                        setFormData({ ...formData, department: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-slate-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                    >
                      <option value="">Select department</option>
                      {departments.map((dept) => (
                        <option key={dept} value={dept}>
                          {dept}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Religion
                  </label>
                  {mode === "view" ? (
                    <p className="text-slate-900 dark:text-white font-medium capitalize">
                      {formData.religion}
                    </p>
                  ) : (
                    <select
                      value={formData.religion}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          religion: e.target.value as any,
                        })
                      }
                      className="w-full px-4 py-3 border border-slate-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                    >
                      {religions.map((religion) => (
                        <option key={religion.value} value={religion.value}>
                          {religion.label}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Email
                  </label>
                  {mode === "view" ? (
                    <p className="text-slate-900 dark:text-white font-medium">
                      {formData.email}
                    </p>
                  ) : (
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-slate-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                      placeholder="Enter email address"
                    />
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Phone
                  </label>
                  {mode === "view" ? (
                    <p className="text-slate-900 dark:text-white font-medium">
                      {formData.phone}
                    </p>
                  ) : (
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-slate-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                      placeholder="Enter phone number"
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Employment & Salary Information */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                Employment & Salary
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Join Date
                  </label>
                  {mode === "view" ? (
                    <p className="text-slate-900 dark:text-white font-medium">
                      {formatDate(formData.joinDate)}
                    </p>
                  ) : (
                    <input
                      type="date"
                      value={formData.joinDate}
                      onChange={(e) =>
                        setFormData({ ...formData, joinDate: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-slate-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                    />
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Base Salary
                  </label>
                  {mode === "view" ? (
                    <p className="text-slate-900 dark:text-white font-medium">
                      {formatCurrency(formData.baseSalary)}
                    </p>
                  ) : (
                    <input
                      type="number"
                      value={formData.baseSalary}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          baseSalary: parseInt(e.target.value) || 0,
                        })
                      }
                      className="w-full px-4 py-3 border border-slate-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                      placeholder="Enter base salary"
                    />
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Bank Account
                  </label>
                  {mode === "view" ? (
                    <p className="text-slate-900 dark:text-white font-medium">
                      {formData.bankAccount}
                    </p>
                  ) : (
                    <input
                      type="text"
                      value={formData.bankAccount}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          bankAccount: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 border border-slate-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                      placeholder="Enter bank account"
                    />
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Overtime Rate (per hour)
                  </label>
                  {mode === "view" ? (
                    <p className="text-slate-900 dark:text-white font-medium">
                      {formatCurrency(formData.overtimeRate || 0)}
                    </p>
                  ) : (
                    <input
                      type="number"
                      value={formData.overtimeRate || 0}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          overtimeRate: parseInt(e.target.value) || 0,
                        })
                      }
                      className="w-full px-4 py-3 border border-slate-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                      placeholder="Enter overtime rate"
                    />
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Status
                  </label>
                  {mode === "view" ? (
                    <span
                      className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                        formData.status === "active"
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400"
                          : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                      }`}
                    >
                      {formData.status}
                    </span>
                  ) : (
                    <select
                      value={formData.status}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          status: e.target.value as "active" | "inactive",
                        })
                      }
                      className="w-full px-4 py-3 border border-slate-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  )}
                </div>

                {mode !== "view" && (
                  <div>
                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={formData.isManagement}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            isManagement: e.target.checked,
                          })
                        }
                        className="h-4 w-4 text-slate-600 focus:ring-slate-500 border-slate-300 rounded"
                      />
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        Management Position (tidak dapat tips)
                      </span>
                    </label>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-slate-200 dark:border-slate-700">
          <div>
            {mode === "view" && employee && (
              <div className="flex items-center space-x-4 text-sm text-slate-500 dark:text-slate-400">
                <span>Employee ID: {employee.id}</span>
                <span>•</span>
                <span>Joined: {formatDate(employee.joinDate)}</span>
              </div>
            )}
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={onClose}
              className="px-6 py-3 border border-slate-200 dark:border-slate-600 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors font-medium"
            >
              {mode === "view" ? "Close" : "Cancel"}
            </button>
            {mode !== "view" && (
              <button
                onClick={handleSave}
                className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center space-x-2 shadow-lg"
              >
                <Save className="h-4 w-4" />
                <span>Save Employee</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-60">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-red-100 dark:bg-red-900/30 p-2 rounded-lg">
                <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Delete Employee
              </h3>
            </div>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              Are you sure you want to delete <strong>{employee?.name}</strong>?
              This action cannot be undone.
            </p>
            <div className="flex items-center justify-end space-x-4">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const EmployeeList: React.FC = () => {
  const [employeeList, setEmployeeList] = useState<Employee[]>(employees);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null
  );
  const [modalMode, setModalMode] = useState<"view" | "edit" | "add">("view");
  const [showModal, setShowModal] = useState(false);

  // Get unique departments
  const departments = Array.from(
    new Set(employeeList.map((emp) => emp.department))
  ).sort();

  // Filter employees
  const filteredEmployees = employeeList.filter((employee) => {
    const matchesSearch =
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment =
      !selectedDepartment || employee.department === selectedDepartment;
    const matchesStatus = !selectedStatus || employee.status === selectedStatus;

    return matchesSearch && matchesDepartment && matchesStatus;
  });

  const handleViewEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
    setModalMode("view");
    setShowModal(true);
  };

  const handleEditEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
    setModalMode("edit");
    setShowModal(true);
  };

  const handleAddEmployee = () => {
    setSelectedEmployee(null);
    setModalMode("add");
    setShowModal(true);
  };

  const handleSaveEmployee = (employee: Employee) => {
    if (modalMode === "add") {
      setEmployeeList([...employeeList, employee]);
    } else {
      setEmployeeList(
        employeeList.map((emp) => (emp.id === employee.id ? employee : emp))
      );
    }
  };

  const handleDeleteEmployee = (employeeId: string) => {
    setEmployeeList(employeeList.filter((emp) => emp.id !== employeeId));
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedEmployee(null);
  };

  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
            Employee Management
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-lg mt-2">
            Manage your team of {employeeList.length} employees
          </p>
        </div>
        <button
          onClick={handleAddEmployee}
          className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center space-x-2 shadow-lg"
        >
          <Plus className="h-5 w-5" />
          <span>Add Employee</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search employees..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-slate-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-slate-500 focus:border-transparent"
            />
          </div>

          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="px-4 py-3 border border-slate-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-slate-500 focus:border-transparent"
          >
            <option value="">All Departments</option>
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-3 border border-slate-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-slate-500 focus:border-transparent"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-600 dark:text-slate-400">
              Showing {filteredEmployees.length} of {employeeList.length}{" "}
              employees
            </span>
          </div>
        </div>
      </div>

      {/* Employee Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredEmployees.map((employee) => (
          <div
            key={employee.id}
            className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700 hover:shadow-xl transition-all duration-300 group"
          >
            {/* Employee Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-4">
                <div className="bg-gradient-to-br from-slate-600 to-slate-800 p-3 rounded-xl text-white font-bold text-lg">
                  {employee.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-lg leading-tight">
                    {employee.name}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">
                    {employee.id}
                  </p>
                </div>
              </div>
              <span
                className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  employee.status === "active"
                    ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400"
                    : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                }`}
              >
                {employee.status}
              </span>
            </div>

            {/* Employee Details */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center space-x-3">
                <Building className="h-4 w-4 text-slate-400 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-slate-900 dark:text-white">
                    {employee.position}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {employee.department}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <DollarSign className="h-4 w-4 text-slate-400 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-slate-900 dark:text-white">
                    {formatCurrency(employee.baseSalary)}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Base Salary
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Calendar className="h-4 w-4 text-slate-400 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-slate-900 dark:text-white">
                    {formatDate(employee.joinDate)}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Join Date
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-slate-400 flex-shrink-0" />
                <p className="text-sm text-slate-600 dark:text-slate-400 truncate">
                  {employee.email}
                </p>
              </div>

              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-slate-400 flex-shrink-0" />
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {employee.phone}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-700">
              <div className="flex items-center space-x-2">
                {employee.isManagement && (
                  <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-400 rounded-full">
                    <Star className="h-3 w-3 mr-1" />
                    Management
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleViewEmployee(employee)}
                  className="p-2 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-all duration-200"
                  title="View Details"
                >
                  <Eye className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleEditEmployee(employee)}
                  className="p-2 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-all duration-200"
                  title="Edit Employee"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDeleteEmployee(employee.id)}
                  className="p-2 text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200"
                  title="Delete Employee"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredEmployees.length === 0 && (
        <div className="text-center py-12">
          <div className="bg-slate-100 dark:bg-slate-800 rounded-full p-12 w-40 h-40 mx-auto mb-6 flex items-center justify-center">
            <Users className="h-16 w-16 text-slate-400" />
          </div>
          <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
            No employees found
          </h3>
          <p className="text-slate-500 dark:text-slate-400 mb-6">
            {searchTerm || selectedDepartment || selectedStatus
              ? "Try adjusting your filters to see more results."
              : "Get started by adding your first employee."}
          </p>
          <button
            onClick={handleAddEmployee}
            className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center space-x-2 mx-auto shadow-lg"
          >
            <Plus className="h-5 w-5" />
            <span>Add Employee</span>
          </button>
        </div>
      )}

      {/* Employee Modal */}
      <EmployeeModal
        employee={selectedEmployee}
        isOpen={showModal}
        mode={modalMode}
        onClose={handleCloseModal}
        onSave={handleSaveEmployee}
        onDelete={handleDeleteEmployee}
      />
    </div>
  );
};

export default EmployeeList;
