"use client";

import { useState } from "react";
import { Search, CalendarIcon } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover";
import { Calendar } from "@/shared/components/ui/calendar";
import { DEPARTMENTS } from "@/shared/constants/departments";
import { ORDER_STATUSES } from "@/shared/constants/order-status";
import { cn } from "@/shared/lib/utils";
import type { AdminFilters } from "../types";

/** yyyy-mm-dd → Date */
function parseDate(value: string): Date | undefined {
  if (!value) return undefined;
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return undefined;
  return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
}

/** Date → yyyy-mm-dd */
function formatIso(date: Date): string {
  const y = date.getFullYear();
  const m = (date.getMonth() + 1).toString().padStart(2, "0");
  const d = date.getDate().toString().padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/** yyyy-mm-dd → yyyy/mm/dd display */
function toDisplay(value: string): string {
  return value ? value.replace(/-/g, "/") : "";
}

function DatePickerInput({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  const [open, setOpen] = useState(false);
  // 타이핑 중간 값을 로컬로 유지 (완전한 날짜일 때만 부모에 전달)
  const [draft, setDraft] = useState<string | null>(null);

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value.replace(/[^0-9/]/g, "");
    const digits = raw.replace(/\//g, "");
    if (digits.length >= 5 && !raw.includes("/")) {
      raw = `${digits.slice(0, 4)}/${digits.slice(4)}`;
    }
    if (digits.length >= 7) {
      raw = `${digits.slice(0, 4)}/${digits.slice(4, 6)}/${digits.slice(6, 8)}`;
    }
    const match = raw.match(/^(\d{4})\/(\d{2})\/(\d{2})$/);
    if (match) {
      // 완전한 날짜 → 부모에 전달하고 draft 해제
      setDraft(null);
      onChange(`${match[1]}-${match[2]}-${match[3]}`);
    } else if (raw === "") {
      setDraft(null);
      onChange("");
    } else {
      // 입력 중 → 로컬 draft만 업데이트
      setDraft(raw);
    }
  };

  const handleCalendarSelect = (date: Date | undefined) => {
    if (date) {
      setDraft(null);
      onChange(formatIso(date));
    }
    setOpen(false);
  };

  // draft가 있으면 draft 표시, 아니면 부모 value 표시
  const displayValue = draft ?? toDisplay(value);

  return (
    <div className="flex items-center gap-1">
      <Input
        placeholder={`${placeholder} (yyyy/mm/dd)`}
        value={displayValue}
        onChange={handleTextChange}
        className="w-[170px]"
        maxLength={10}
      />
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" size="icon-sm" className="shrink-0">
            <CalendarIcon className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={parseDate(value)}
            onSelect={handleCalendarSelect}
            defaultMonth={parseDate(value)}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}

interface OrderFiltersProps {
  filters: AdminFilters;
  onFiltersChange: (filters: AdminFilters) => void;
}

export function OrderFilters({ filters, onFiltersChange }: OrderFiltersProps) {
  return (
    <div className="space-y-3">
      {/* Status tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        <Button
          size="sm"
          variant={filters.status === "ALL" ? "default" : "outline"}
          onClick={() => onFiltersChange({ ...filters, status: "ALL" })}
        >
          전체
        </Button>
        {ORDER_STATUSES.map((s) => (
          <Button
            key={s.value}
            size="sm"
            variant={filters.status === s.value ? "default" : "outline"}
            onClick={() => onFiltersChange({ ...filters, status: s.value })}
            className={cn(
              filters.status === s.value && s.value === "PENDING" && "bg-yellow-600 hover:bg-yellow-700",
              filters.status === s.value && s.value === "COMPLETED" && "bg-green-600 hover:bg-green-700",
            )}
          >
            {s.label}
          </Button>
        ))}
      </div>

      {/* Type, Department, Search */}
      <div className="flex gap-2">
        <Select
          value={filters.type || "ALL"}
          onValueChange={(v) =>
            onFiltersChange({ ...filters, type: v === "ALL" ? "" : v })
          }
        >
          <SelectTrigger className="w-[100px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">전체</SelectItem>
            <SelectItem value="snack">간식</SelectItem>
            <SelectItem value="breakfast">조식</SelectItem>
            <SelectItem value="supply">비품</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={filters.department || "all"}
          onValueChange={(v) =>
            onFiltersChange({ ...filters, department: v === "all" ? "" : v })
          }
        >
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="부서 선택" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">전체 부서</SelectItem>
            {DEPARTMENTS.map((dept) => (
              <SelectItem key={dept.value} value={dept.value}>
                {dept.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="이름 검색"
            value={filters.search}
            onChange={(e) =>
              onFiltersChange({ ...filters, search: e.target.value })
            }
            className="pl-9"
          />
        </div>
      </div>

      {/* Date range */}
      <div className="flex items-center gap-2">
        <DatePickerInput
          value={filters.dateFrom}
          onChange={(v) => onFiltersChange({ ...filters, dateFrom: v })}
          placeholder="시작일"
        />
        <span className="text-sm text-muted-foreground">~</span>
        <DatePickerInput
          value={filters.dateTo}
          onChange={(v) => onFiltersChange({ ...filters, dateTo: v })}
          placeholder="종료일"
        />
        {(filters.dateFrom || filters.dateTo) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() =>
              onFiltersChange({ ...filters, dateFrom: "", dateTo: "" })
            }
          >
            초기화
          </Button>
        )}
      </div>
    </div>
  );
}
