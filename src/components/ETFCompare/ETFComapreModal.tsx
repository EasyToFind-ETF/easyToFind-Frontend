import React from "react";
import ETFCompareToast from "./ETFCompareToast";

interface CompareModalProps {
  visible: boolean;
  onClose: () => void;
  etfs: any[];
}

export default function CompareModal({ visible, onClose, etfs }: CompareModalProps) {
  if (!visible) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(0,0,0,0.3)",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "auto",
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "#fff",
          boxShadow: "0 4px 32px rgba(0,0,0,0.15)",
          width: "min(1250px, 96vw)",
          height: "min(90vh, auto)",
          maxHeight: "90vh",
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          overflowY: "auto",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: 16,
            right: 16,
            background: "transparent",
            border: "none",
            fontSize: 24,
            cursor: "pointer",
          }}
          aria-label="닫기"
        >
          ×
        </button>
        <div className="w-full h-full">
          <ETFCompareToast etfs={etfs} />
        </div>
      </div>
    </div>
  );
}
