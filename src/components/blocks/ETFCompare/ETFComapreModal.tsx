import React from "react";
import ETFCompareToast from "./ETFCompareToast";

interface CompareModalProps {
  visible: boolean;
  onClose: () => void;
  etfs: any[];
}

export default function CompareModal({
  visible,
  onClose,
  etfs,
}: CompareModalProps) {
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
          width: "min(1250px, 100vw)",
          height: "90vh",
          maxWidth: "100vw",
          maxHeight: "90vh",
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          overflow: "hidden",
          borderRadius: "4rem",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: 32,
            right: 32,
            background: "transparent",
            border: "none",
            fontSize: 24,
            cursor: "pointer",
            zIndex: 10,
          }}
          aria-label="닫기"
        >
          ×
        </button>
        <div className="w-full h-full overflow-y-auto">
          <ETFCompareToast etfs={etfs} />
        </div>
      </div>
    </div>
  );
}
