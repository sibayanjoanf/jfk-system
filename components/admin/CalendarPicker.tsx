"use client";

import React, { useState, useRef, useEffect } from "react";
import { Calendar, ChevronLeft, ChevronRight, X } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

function buildCalendarDays(year: number, month: number) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrev = new Date(year, month, 0).getDate();
  const cells: { day: number; current: boolean }[] = [];
  for (let i = firstDay - 1; i >= 0; i--)
    cells.push({ day: daysInPrev - i, current: false });
  for (let d = 1; d <= daysInMonth; d++) cells.push({ day: d, current: true });
  const remaining = 42 - cells.length;
  for (let d = 1; d <= remaining; d++) cells.push({ day: d, current: false });
  return cells;
}

export type DateFilter =
  | { type: "year"; year: number }
  | { type: "month"; year: number; month: number }
  | { type: "day"; date: Date };

interface CalendarPickerProps {
  value: DateFilter | null;
  onChange: (filter: DateFilter | null) => void;
}

function formatFilter(f: DateFilter): string {
  if (f.type === "year") return String(f.year);
  if (f.type === "month") return `${MONTHS[f.month].slice(0, 3)} ${f.year}`;
  return f.date.toLocaleDateString("en-PH", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

const CalendarPicker: React.FC<CalendarPickerProps> = ({ value, onChange }) => {
  const [open, setOpen] = useState(false);
  const [calYear, setCalYear] = useState(new Date().getFullYear());
  const [calMonth, setCalMonth] = useState(new Date().getMonth());
  const [view, setView] = useState<"year" | "month" | "day">("day");
  const ref = useRef<HTMLDivElement>(null);
  const today = new Date();

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setView("day");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const calendarDays = buildCalendarDays(calYear, calMonth);

  const isToday = (day: number) =>
    day === today.getDate() &&
    calMonth === today.getMonth() &&
    calYear === today.getFullYear();

  const isSelectedDay = (day: number) =>
    value?.type === "day" &&
    day === value.date.getDate() &&
    calMonth === value.date.getMonth() &&
    calYear === value.date.getFullYear();

  const isSelectedMonth = (i: number) =>
    value?.type === "month" && value.month === i && value.year === calYear;

  const isSelectedYear = (yr: number) =>
    value?.type === "year" && value.year === yr;

  const prevMonth = () => {
    if (calMonth === 0) {
      setCalMonth(11);
      setCalYear((y) => y - 1);
    } else setCalMonth((m) => m - 1);
  };
  const nextMonth = () => {
    if (calMonth === 11) {
      setCalMonth(0);
      setCalYear((y) => y + 1);
    } else setCalMonth((m) => m + 1);
  };

  const handleDayClick = (day: number, current: boolean) => {
    if (!current) return;
    onChange({ type: "day", date: new Date(calYear, calMonth, day) });
    setOpen(false);
    setView("day");
  };

  const handleMonthClick = (i: number) => {
    onChange({ type: "month", year: calYear, month: i });
    setCalMonth(i);
    setOpen(false);
    setView("day");
  };

  const handleYearClick = (yr: number) => {
    onChange({ type: "year", year: yr });
    setCalYear(yr);
    setOpen(false);
    setView("day");
  };

  return (
    <div className="relative" ref={ref}>
      {/* Trigger button */}
      <TooltipProvider delayDuration={200}>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={() => setOpen(!open)}
              className={`flex items-center gap-2 border rounded-lg font-medium text-xs transition-all
          ${
            open
              ? "p-2 bg-red-600 border-transparent text-white shadow-sm"
              : value
                ? "pl-3 pr-2 py-2 border-red-500 bg-red-50 text-red-600"
                : "p-2 border-red-200 text-red-500 hover:bg-red-50"
          }`}
            >
              <Calendar size={14} strokeWidth={2} className="shrink-0" />
              {value && (
                <>
                  <span className="whitespace-nowrap">
                    {formatFilter(value)}
                  </span>
                  <span
                    onClick={(e) => {
                      e.stopPropagation();
                      onChange(null);
                    }}
                    className="ml-0.5 flex items-center justify-center w-4 h-4 rounded-full hover:bg-red-200 transition-colors cursor-pointer"
                  >
                    <X size={10} strokeWidth={2.5} />
                  </span>
                </>
              )}
            </button>
          </TooltipTrigger>
          <TooltipContent
            side="bottom"
            sideOffset={5}
            className="text-[10px] py-1 px-2 bg-red-600"
          >
            <p>Calendar Filter</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {open && (
        <div className="animate-in fade-in slide-in-from-top-2 duration-150 absolute right-0 mt-2 w-72 bg-white border border-gray-100 rounded-2xl shadow-2xl z-50 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 pt-4 pb-3">
            <button
              onClick={prevMonth}
              className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors text-gray-500"
            >
              <ChevronLeft size={14} />
            </button>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setView(view === "month" ? "day" : "month")}
                className={`px-2 py-0.5 rounded-md text-sm font-semibold transition-colors
                  ${view === "month" ? "bg-red-50 text-red-600" : "text-gray-900 hover:bg-gray-100"}`}
              >
                {MONTHS[calMonth]}
              </button>
              <button
                onClick={() => setView(view === "year" ? "day" : "year")}
                className={`px-2 py-0.5 rounded-md text-sm font-semibold transition-colors
                  ${view === "year" ? "bg-red-50 text-red-600" : "text-gray-900 hover:bg-gray-100"}`}
              >
                {calYear}
              </button>
            </div>
            <button
              onClick={nextMonth}
              className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors text-gray-500"
            >
              <ChevronRight size={14} />
            </button>
          </div>

          {/* Filter mode tabs */}
          <div className="px-4 pb-2 flex items-center gap-1.5">
            {(["year", "month", "day"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setView(t)}
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold capitalize transition-colors
                  ${
                    view === t
                      ? "bg-red-600 text-white"
                      : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                  }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Year view */}
          {view === "year" && (
            <div className="grid grid-cols-4 gap-1.5 px-3 pb-4 max-h-52 overflow-y-auto">
              {Array.from({ length: 12 }, (_, i) => calYear - 5 + i).map(
                (yr) => (
                  <button
                    key={yr}
                    onClick={() => handleYearClick(yr)}
                    className={`py-2 rounded-lg text-xs font-medium transition-colors
                    ${
                      isSelectedYear(yr)
                        ? "bg-red-600 text-white"
                        : yr === today.getFullYear()
                          ? "border border-red-300 text-red-600"
                          : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {yr}
                  </button>
                ),
              )}
            </div>
          )}

          {/* Month view */}
          {view === "month" && (
            <div className="grid grid-cols-3 gap-1.5 px-3 pb-4">
              {MONTHS.map((m, i) => (
                <button
                  key={m}
                  onClick={() => handleMonthClick(i)}
                  className={`py-2 rounded-lg text-xs font-medium transition-colors
                    ${
                      isSelectedMonth(i)
                        ? "bg-red-600 text-white"
                        : i === today.getMonth() &&
                            calYear === today.getFullYear()
                          ? "border border-red-300 text-red-600"
                          : "text-gray-700 hover:bg-gray-100"
                    }`}
                >
                  {m.slice(0, 3)}
                </button>
              ))}
            </div>
          )}

          {/* Day view */}
          {view === "day" && (
            <>
              <div className="grid grid-cols-7 px-3 pb-1">
                {DAYS.map((d) => (
                  <div
                    key={d}
                    className="text-center text-[10px] font-semibold text-gray-400 py-1"
                  >
                    {d}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 px-3 pb-4 gap-y-0.5">
                {calendarDays.map((cell, i) => (
                  <button
                    key={i}
                    onClick={() => handleDayClick(cell.day, cell.current)}
                    disabled={!cell.current}
                    className={`
                      relative h-8 w-full flex items-center justify-center text-xs rounded-lg transition-colors
                      ${!cell.current ? "text-gray-300 cursor-default" : "cursor-pointer"}
                      ${
                        cell.current && isSelectedDay(cell.day)
                          ? "bg-red-600 text-white font-semibold"
                          : cell.current && isToday(cell.day)
                            ? "border border-red-300 text-red-600 font-medium hover:bg-red-50"
                            : cell.current
                              ? "text-gray-700 hover:bg-gray-100"
                              : ""
                      }
                    `}
                  >
                    {cell.day}
                  </button>
                ))}
              </div>
            </>
          )}

          {/* Footer */}
          <div className="border-t border-gray-100 px-4 py-3 flex items-center justify-between">
            {value && (
              <button
                onClick={() => onChange(null)}
                className="text-xs text-red-500 hover:text-red-700 transition-colors"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarPicker;
