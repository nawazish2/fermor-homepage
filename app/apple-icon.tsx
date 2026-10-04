import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#FFC93C",
        }}
      >
        <svg width="120" height="120" viewBox="0 0 32 32">
          <path fill="#101A3A" d="M10 7h13v4h-9v3.5h7.5v4H14V25h-4z" />
        </svg>
      </div>
    ),
    size,
  );
}
