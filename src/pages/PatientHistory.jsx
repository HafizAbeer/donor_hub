import React, { useEffect, useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";

const STATUS_OPTIONS = [
  { value: "pending", label: "Pending" },
  { value: "completed", label: "Completed" },
];
const STATUS_VALUES = STATUS_OPTIONS.map((option) => option.value);

const COUNTRY_CODES = [
  {
    country: "Pakistan",
    dialCode: "+92",
    maxLength: 10,
    placeholder: "3001234567",
  },
  {
    country: "Bangladesh",
    dialCode: "+880",
    maxLength: 10,
    placeholder: "1700123456",
  },
  {
    country: "India",
    dialCode: "+91",
    maxLength: 10,
    placeholder: "9000012345",
  },
  {
    country: "Nepal",
    dialCode: "+977",
    maxLength: 10,
    placeholder: "9800012345",
  },
  {
    country: "Sri Lanka",
    dialCode: "+94",
    maxLength: 9,
    placeholder: "701234567",
  },
  {
    country: "Other",
    dialCode: "+00",
    maxLength: 12,
    placeholder: "1234567890",
  },
];

const EMPTY_FORM = {
  patientName: "",
  bloodGroup: "",
  hospital: "",
  countryCode: COUNTRY_CODES[0].dialCode,
  contactNumber: "",
  status: STATUS_OPTIONS[0].value,
  notes: "",
};

const STORAGE_KEY = "patientHistoryRecords";
const normalizeStatus = (value) => {
  const normalized = (value ?? "").toString().trim().toLowerCase();
  return STATUS_VALUES.includes(normalized)
    ? normalized
    : STATUS_OPTIONS[0].value;
};

const getCountryMeta = (code) =>
  COUNTRY_CODES.find((option) => option.dialCode === code) || COUNTRY_CODES[0];

const sanitizePhone = (value, maxLength) =>
  (value || "").replace(/\D/g, "").slice(0, maxLength);

const normalizeRecord = (record) => {
  const countryMeta = getCountryMeta(record?.countryCode);
  return {
    id:
      record?.id ||
      (crypto.randomUUID
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random()}`),
    patientName: record?.patientName || "",
    bloodGroup: record?.bloodGroup || "",
    hospital: record?.hospital || "",
    countryCode: countryMeta.dialCode,
    contactNumber: sanitizePhone(
      record?.contactNumber || "",
      countryMeta.maxLength
    ),
    status: normalizeStatus(record?.status),
    notes: record?.notes || "",
    createdAt: record?.createdAt || new Date().toISOString(),
    createdBy: record?.createdBy || "unknown@user",
    createdByRole: record?.createdByRole || "user",
  };
};

export default function PatientHistory() {
  const { user, isAdmin, isSuperAdmin } = useAuth();
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [records, setRecords] = useState([]);
  const [activeTab, setActiveTab] = useState("pending");
  const userEmail = user?.email || "anonymous@user.com";
  const canViewAllRecords = isAdmin || isSuperAdmin;

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setRecords(parsed.map(normalizeRecord));
        } else {
          setRecords([]);
        }
      }
    } catch (error) {
      console.error("Failed to load patient history", error);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  }, [records]);

  const selectedCountry = useMemo(() => {
    return getCountryMeta(formData.countryCode);
  }, [formData.countryCode]);

  const scopedRecords = useMemo(() => {
    if (canViewAllRecords) {
      return records;
    }
    return records.filter((record) => record.createdBy === userEmail);
  }, [records, canViewAllRecords, userEmail]);

  const pendingCount = useMemo(
    () => scopedRecords.filter((record) => record.status === "pending").length,
    [scopedRecords]
  );
  const completedCount = useMemo(
    () =>
      scopedRecords.filter((record) => record.status === "completed").length,
    [scopedRecords]
  );

  const filteredRecords = useMemo(
    () => scopedRecords.filter((record) => record.status === activeTab),
    [scopedRecords, activeTab]
  );

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name === "countryCode") {
      const meta = getCountryMeta(value);
      setFormData((prev) => ({
        ...prev,
        countryCode: value,
        contactNumber: prev.contactNumber.slice(0, meta.maxLength),
      }));
      return;
    }
    const nextValue = name === "status" ? normalizeStatus(value) : value;
    setFormData((prev) => ({ ...prev, [name]: nextValue }));
  };

  const handleContactChange = (event) => {
    const digitsOnly = sanitizePhone(
      event.target.value,
      selectedCountry.maxLength
    );
    setFormData((prev) => ({
      ...prev,
      contactNumber: digitsOnly,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!formData.patientName.trim() || !formData.bloodGroup.trim()) {
      return;
    }

    const normalizedRecord = normalizeRecord({
      ...formData,
      status: normalizeStatus(formData.status),
      contactNumber: sanitizePhone(
        formData.contactNumber,
        selectedCountry.maxLength
      ),
      id: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}`,
      createdAt: new Date().toISOString(),
      createdBy: userEmail,
      createdByRole: user?.role || "user",
    });

    setRecords((prev) => [normalizedRecord, ...prev]);
    setFormData({ ...EMPTY_FORM });
    setActiveTab("pending");
  };

  const handleStatusChange = (id, status) => {
    const record = records.find((entry) => entry.id === id);
    if (!record) return;

    const canModify = canViewAllRecords || record.createdBy === userEmail;
    if (!canModify) return;
    const nextStatus = normalizeStatus(status);

    setRecords((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              status: nextStatus,
            }
          : item
      )
    );
  };

  const handleClearAll = () => {
    if (!canViewAllRecords || records.length === 0) return;
    const shouldClear = window.confirm("Clear all patient history records?");
    if (shouldClear) {
      setRecords([]);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-red-200 bg-white/70 backdrop-blur">
        <CardHeader>
          <CardTitle className="text-red-900">Add Patient History</CardTitle>
          <CardDescription>
            Track patients who currently need blood so the team can follow up
            quickly.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="patientName">Patient Name *</Label>
              <Input
                id="patientName"
                name="patientName"
                value={formData.patientName}
                onChange={handleChange}
                placeholder="Enter patient name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bloodGroup">Blood Group *</Label>
              <Input
                id="bloodGroup"
                name="bloodGroup"
                value={formData.bloodGroup}
                onChange={handleChange}
                placeholder="e.g. A+, O-, AB+"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="hospital">Hospital / Location</Label>
              <Input
                id="hospital"
                name="hospital"
                value={formData.hospital}
                onChange={handleChange}
                placeholder="Civil Hospital, Faisalabad"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactNumber">Contact Number</Label>
              <div className="flex gap-2">
                <select
                  id="countryCode"
                  name="countryCode"
                  value={formData.countryCode}
                  onChange={handleChange}
                  className="rounded-md border border-red-200 bg-white px-2 py-2 text-sm focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-200"
                >
                  {COUNTRY_CODES.map((option) => (
                    <option key={option.dialCode} value={option.dialCode}>
                      {option.country} ({option.dialCode})
                    </option>
                  ))}
                </select>
                <Input
                  id="contactNumber"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleContactChange}
                  placeholder={selectedCountry.placeholder}
                  inputMode="numeric"
                  pattern="\d*"
                  maxLength={selectedCountry.maxLength}
                  className="flex-1"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full rounded-md border border-red-200 bg-white px-3 py-2 text-sm focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-200"
              >
                {STATUS_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <textarea
                id="notes"
                name="notes"
                rows="3"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Urgency, blood units required, additional contact, etc."
                className="w-full rounded-md border border-red-200 bg-white px-3 py-2 text-sm focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-200"
              />
            </div>
            <div className="md:col-span-2 flex flex-col gap-3 sm:flex-row">
              <Button
                type="submit"
                className="bg-red-600 hover:bg-red-700 text-white flex-1"
              >
                Save Patient Request
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setFormData(EMPTY_FORM)}
              >
                Reset Form
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="border-red-200 bg-white/70 backdrop-blur">
        <CardHeader className="space-y-4">
          <div>
            <CardTitle className="text-red-900">Patient Requests</CardTitle>
            <CardDescription>
              Review patient history and update the fulfilment status.
            </CardDescription>
          </div>
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="inline-flex items-center rounded-full bg-red-50 p-1 text-sm font-semibold text-red-600 dark:bg-red-900/20">
              <button
                type="button"
                onClick={() => setActiveTab("pending")}
                className={`rounded-full px-4 py-1 transition ${
                  activeTab === "pending"
                    ? "bg-white text-red-700 shadow"
                    : "text-red-500"
                }`}
              >
                Pending ({pendingCount})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("completed")}
                className={`rounded-full px-4 py-1 transition ${
                  activeTab === "completed"
                    ? "bg-white text-red-700 shadow"
                    : "text-red-500"
                }`}
              >
                Completed ({completedCount})
              </button>
            </div>
            {canViewAllRecords && (
              <Button
                type="button"
                variant="ghost"
                className="text-red-600 hover:bg-red-100"
                onClick={handleClearAll}
              >
                Clear All
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {filteredRecords.length === 0 ? (
            <p className="text-sm text-red-700/80 text-center py-6">
              No {activeTab} patient history yet. Use the form above to add a
              new request.
            </p>
          ) : (
            filteredRecords.map((record) => (
              <div
                key={record.id}
                className="rounded-lg border border-red-100 bg-white/80 p-4 shadow-sm space-y-3"
              >
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-red-900">
                      {record.patientName}
                    </p>
                    <p className="text-xs text-red-600">
                      Blood Group: {record.bloodGroup}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs uppercase text-red-500 tracking-wide">
                      Status
                    </span>
                    <select
                      value={record.status}
                      onChange={(event) =>
                        handleStatusChange(record.id, event.target.value)
                      }
                      className="rounded-md border border-red-200 bg-white px-2 py-1 text-xs focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-200"
                    >
                      {STATUS_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="grid gap-2 text-sm md:grid-cols-2">
                  {record.hospital && (
                    <p className="text-red-700">
                      <span className="font-semibold">Hospital:</span>{" "}
                      {record.hospital}
                    </p>
                  )}
                  {(record.countryCode || record.contactNumber) && (
                    <p className="text-red-700">
                      <span className="font-semibold">Contact:</span>{" "}
                      {`${record.countryCode || ""} ${
                        record.contactNumber || ""
                      }`.trim()}
                    </p>
                  )}
                </div>
                {record.notes && (
                  <p className="text-sm text-red-800 bg-red-50 rounded-md p-2">
                    {record.notes}
                  </p>
                )}
                <Separator />
                <p className="text-xs text-red-500">
                  Added on {new Date(record.createdAt).toLocaleString()}
                </p>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
