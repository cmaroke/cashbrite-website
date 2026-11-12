"use client";
import { useEffect, useRef } from "react";
import { trackFunnel, type FunnelEventName } from "@/lib/funnelAnalytics";
export function FunnelEvent({ name }: { name: FunnelEventName }) {
  const sent = useRef(false);
  useEffect(() => { if (!sent.current) { sent.current = true; trackFunnel(name); } }, [name]);
  return null;
}
