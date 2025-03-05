"use client"

import { useEffect } from "react"
import { initializeMockData } from "@/lib/mock-data"

export default function MockDataInitializer() {
  useEffect(() => {
    initializeMockData()
  }, [])

  return null
}

