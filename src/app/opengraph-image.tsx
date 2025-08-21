import { ImageResponse } from "next/og";
import {
  PROJECT_TITLE,
  PROJECT_DESCRIPTION,
  PROJECT_AVATAR_URL,
} from "~/lib/constants";

export const alt = PROJECT_TITLE;
export const contentType = "image/png";
export const size = {
  width: 1200,
  height: 630,
};

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
          backgroundColor: "#1a1a1a",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background gradient with pink and purple for financial services */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "linear-gradient(135deg, #EC4899 0%, #8B5CF6 50%, #06B6D4 100%)",
            opacity: 0.9,
          }}
        />

        {/* Subtle pattern overlay for depth */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage:
              "radial-gradient(circle at 25% 25%, rgba(236, 72, 153, 0.3) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(6, 182, 212, 0.3) 0%, transparent 50%)",
          }}
        />

        {/* Main content container - centered in safe zone */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "100%",
            padding: "60px",
            position: "relative",
            zIndex: 10,
          }}
        >
          {/* User avatar with glow effect */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "48px",
              position: "relative",
            }}
          >
            {/* Glow effect */}
            <div
              style={{
                position: "absolute",
                width: "140px",
                height: "140px",
                borderRadius: "50%",
                background:
                  "radial-gradient(circle, rgba(255, 255, 255, 0.3) 0%, transparent 70%)",
                filter: "blur(20px)",
              }}
            />
            {/* Avatar container */}
            <div
              style={{
                width: "120px",
                height: "120px",
                borderRadius: "50%",
                overflow: "hidden",
                border: "6px solid rgba(255, 255, 255, 0.95)",
                backgroundColor: "#ffffff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={PROJECT_AVATAR_URL}
                alt="User avatar"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </div>
          </div>

          {/* Project title with high contrast */}
          <h1
            style={{
              fontSize: PROJECT_TITLE.length > 25 ? "65px" : "72px",
              fontWeight: "900",
              color: "#ffffff",
              textAlign: "center",
              marginBottom: "40px",
              lineHeight: 1.1,
              letterSpacing: "-2px",
              textShadow: "0 6px 20px rgba(0, 0, 0, 0.4)",
              maxWidth: "1100px",
              fontFamily: "system-ui, -apple-system, sans-serif",
              whiteSpace: PROJECT_TITLE.length > 40 ? "normal" : "nowrap",
              paddingLeft: "20px",
              paddingRight: "20px",
            }}
          >
            {PROJECT_TITLE}
          </h1>

          {/* Project description */}
          <p
            style={{
              fontSize: "32px",
              fontWeight: "600",
              color: "rgba(255, 255, 255, 0.95)",
              textAlign: "center",
              marginBottom: "40px",
              lineHeight: 1.3,
              textShadow: "0 3px 12px rgba(0, 0, 0, 0.4)",
              maxWidth: "900px",
              fontFamily: "system-ui, -apple-system, sans-serif",
            }}
          >
            {PROJECT_DESCRIPTION}
          </p>

          {/* Currency badges */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "20px",
              marginBottom: "40px",
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            {/* Crypto badges */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                padding: "12px 24px",
                backgroundColor: "rgba(255, 255, 255, 0.15)",
                borderRadius: "30px",
                border: "2px solid rgba(255, 255, 255, 0.3)",
                backdropFilter: "blur(10px)",
              }}
            >
              <span
                style={{
                  fontSize: "24px",
                  fontWeight: "700",
                  color: "#ffffff",
                  fontFamily: "system-ui, -apple-system, sans-serif",
                }}
              >
                USDC • USDT • ETH • BTC
              </span>
            </div>

            <div
              style={{
                fontSize: "28px",
                color: "rgba(255, 255, 255, 0.8)",
                fontWeight: "400",
              }}
            >
              →
            </div>

            {/* Fiat badges */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                padding: "12px 24px",
                backgroundColor: "rgba(255, 255, 255, 0.15)",
                borderRadius: "30px",
                border: "2px solid rgba(255, 255, 255, 0.3)",
                backdropFilter: "blur(10px)",
              }}
            >
              <span
                style={{
                  fontSize: "24px",
                  fontWeight: "700",
                  color: "#ffffff",
                  fontFamily: "system-ui, -apple-system, sans-serif",
                }}
              >
                KSH • TZS • NGN • M-Pesa
              </span>
            </div>
          </div>

          {/* Farcaster branding element */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
              padding: "20px 40px",
              backgroundColor: "rgba(255, 255, 255, 0.2)",
              borderRadius: "100px",
              border: "3px solid rgba(255, 255, 255, 0.4)",
              backdropFilter: "blur(10px)",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
            }}
          >
            {/* Farcaster icon */}
            <svg
              width="32"
              height="32"
              viewBox="0 0 256 256"
              fill="none"
              style={{
                display: "block",
              }}
            >
              <rect width="256" height="256" rx="56" fill="#7C65C1"></rect>
              <path
                d="M183.296 71.68H211.968L207.872 94.208H200.704V180.224L201.02 180.232C204.266 180.396 206.848 183.081 206.848 186.368V191.488L207.164 191.496C210.41 191.66 212.992 194.345 212.992 197.632V202.752H155.648V197.632C155.648 194.345 158.229 191.66 161.476 191.496L161.792 191.488V186.368C161.792 183.081 164.373 180.396 167.62 180.232L167.936 180.224V138.24C167.936 116.184 150.056 98.304 128 98.304C105.944 98.304 88.0638 116.184 88.0638 138.24V180.224L88.3798 180.232C91.6262 180.396 94.2078 183.081 94.2078 186.368V191.488L94.5238 191.496C97.7702 191.66 100.352 194.345 100.352 197.632V202.752H43.0078V197.632C43.0078 194.345 45.5894 191.66 48.8358 191.496L49.1518 191.488V186.368C49.1518 183.081 51.7334 180.396 54.9798 180.232L55.2958 180.224V94.208H48.1278L44.0318 71.68H72.7038V54.272H183.296V71.68Z"
                fill="white"
              ></path>
            </svg>
            <span
              style={{
                fontSize: "26px",
                fontWeight: "700",
                color: "#ffffff",
                fontFamily: "system-ui, -apple-system, sans-serif",
                letterSpacing: "-0.5px",
              }}
            >
              Farcaster Mini App
            </span>
          </div>
        </div>

        {/* Bottom gradient fade for depth */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "200px",
            background:
              "linear-gradient(to top, rgba(0, 0, 0, 0.4) 0%, transparent 100%)",
          }}
        />
      </div>
    ),
    {
      ...size,
    },
  );
}
