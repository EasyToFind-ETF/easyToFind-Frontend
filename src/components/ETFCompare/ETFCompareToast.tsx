"use client"
import { X } from "lucide-react"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface ETF {
  id: string
  name: string
  code: string
  price: number
  returns: {
    "1주": number
    "1개월": number
    "3개월": number
    "6개월": number
    "1년": number
    "3년": number
    상장이후: number
  }
  overallScore: number
  sharpRatio: number
  maxDrawdown: number
  volatility: number
  netAssets: string
  listingDate: string
  managementCompany: string
}

interface ETFComparisonViewProps {
  etfs: ETF[]
  onRemoveETF?: (etfId: string) => void
  onBackToList?: () => void
}

const CircularProgress = ({
  value,
  size = 60,
  color = "#ef4444",
}: { value: number; size?: number; color?: string }) => {
  const radius = (size - 8) / 2
  const circumference = 2 * Math.PI * radius
  const strokeDasharray = circumference
  const strokeDashoffset = circumference - (value / 100) * circumference

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} stroke="#f1f5f9" strokeWidth="4" fill="none" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth="4"
          fill="none"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-sm font-bold" style={{ color }}>
          {Math.round(value)}
        </span>
      </div>
    </div>
  )
}

const formatReturn = (value: number) => {
  const color = value >= 0 ? "text-red-500" : "text-blue-500"
  return (
    <span className={`font-medium ${color}`}>
      {value > 0 ? "+" : ""}
      {value.toFixed(2)}%
    </span>
  )
}

const getRiskLevel = (score: number) => {
  if (score >= 90) return { level: 1, text: "매우 낮은 위험", color: "#10b981" }
  if (score >= 80) return { level: 2, text: "낮은 위험", color: "#3b82f6" }
  if (score >= 70) return { level: 3, text: "보통 위험", color: "#f59e0b" }
  if (score >= 60) return { level: 4, text: "높은 위험", color: "#ef4444" }
  return { level: 5, text: "매우 높은 위험", color: "#dc2626" }
}

export default function ETFComparisonView({ etfs, onRemoveETF, onBackToList }: ETFComparisonViewProps) {
  const periods = ["1주", "1개월", "3개월", "6개월", "1년", "3년"]

  const comparisonRows = [
    {
      label: "종합점수",
      key: "overallScore",
      render: (etf: ETF) => {
        const risk = getRiskLevel(etf.overallScore)
        return (
          <div className="flex flex-col items-center gap-2">
            <CircularProgress value={etf.overallScore} color={risk.color} />
            <span className="text-xs text-gray-500">{risk.text}</span>
          </div>
        )
      },
    },
    {
      label: "기준가",
      key: "price",
      render: (etf: ETF) => (
        <div className="text-center">
          <span className="font-bold text-lg">{etf.price != null ? etf.price.toLocaleString() : "-"}</span>
          <span className="text-gray-500 text-sm ml-1">원</span>
        </div>
      ),
    },
    {
      label: "최대낙폭",
      key: "maxDrawdown",
      render: (etf: ETF) => (
        <div className="text-center">
          <span className="font-medium text-blue-600">{etf.maxDrawdown}%</span>
        </div>
      ),
    },
    {
      label: "샤프비율",
      key: "sharpRatio",
      render: (etf: ETF) => (
        <div className="text-center">
          <span className="font-medium text-green-600">{etf.sharpRatio}</span>
        </div>
      ),
    },
    {
      label: "변동성",
      key: "volatility",
      render: (etf: ETF) => (
        <div className="text-center">
          <span className="font-medium text-blue-600">{etf.volatility}%</span>
        </div>
      ),
    },
    {
      label: "순자산 총액",
      key: "netAssets",
      render: (etf: ETF) => (
        <div className="text-center">
          <span className="font-medium">{etf.netAssets}</span>
        </div>
      ),
    },
    {
      label: "자산운용사",
      key: "managementCompany",
      render: (etf: ETF) => (
        <div className="text-center">
          <span className="font-medium text-sm">{etf.managementCompany}</span>
        </div>
      ),
    },
  ]

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-gray-900">ETF 비교 ({etfs.length}/5)</h1>
          {onBackToList && (
            <Button variant="outline" onClick={onBackToList} className="flex items-center gap-2 bg-transparent">
              <X className="w-4 h-4" />
              목록으로 돌아가기
            </Button>
          )}
        </div>

        {/* Comparison Table */}
        <Card className="shadow-sm overflow-hidden">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                {/* Header Row */}
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left p-4 font-medium text-gray-700 bg-gray-50 sticky left-0 z-10 min-w-[120px]">
                      비교항목
                    </th>
                    {etfs.map((etf) => (
                      <th key={etf.id} className="p-4 bg-blue-500 text-white relative min-w-[200px]">
                        {onRemoveETF && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="absolute top-2 right-2 h-6 w-6 text-white hover:bg-blue-600"
                            onClick={() => onRemoveETF(etf.id)}
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        )}
                        <div className="pr-8">
                          <div className="font-medium text-sm mb-1">{etf.name}</div>
                          <div className="text-xs opacity-90">{etf.code}</div>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>

                {/* Data Rows */}
                <tbody>
                  {comparisonRows.map((row, index) => (
                    <tr
                      key={row.key}
                      className={`border-b border-gray-100 ${index % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
                    >
                      <td className="p-4 font-medium text-gray-700 bg-gray-50 sticky left-0 z-10 border-r border-gray-200">
                        {row.label}
                      </td>
                      {etfs.map((etf) => (
                        <td key={etf.id} className="p-4 text-center">
                          {row.render(etf)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Additional Performance Comparison */}
        <Card className="mt-6 shadow-sm">
          <CardContent className="p-6">
            <h3 className="text-lg font-bold mb-4">기간별 수익률 비교</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left p-3 font-medium text-gray-700 bg-gray-50">ETF명</th>
                    {periods.map((period) => (
                      <th key={period} className="p-3 text-center font-medium text-gray-700 bg-gray-50">
                        {period}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {etfs.map((etf, index) => (
                    <tr
                      key={etf.id}
                      className={`border-b border-gray-100 ${index % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
                    >
                      <td className="p-3 font-medium text-gray-900">{etf.name}</td>
                      {periods.map((period) => (
                        <td key={period} className="p-3 text-center">
                          {etf.returns && period in etf.returns
  ? formatReturn(etf.returns[period as keyof typeof etf.returns])
  : "-"}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
