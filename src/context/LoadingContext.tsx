"use client"
import React, { createContext, useContext, useState } from 'react'

type LoadingContextType = {
  isLoading: boolean
  setLoading: (value: boolean) => void
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined)

export const LoadingProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isLoading, setIsLoading] = useState(false)

  const setLoading = (value: boolean) => {
    setIsLoading(value)
  }

  return (
    <LoadingContext.Provider value={{ isLoading, setLoading }}>
      {children}
      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center gap-2 bg-transparent">
          <div className="absolute z-40 h-full w-full rounded-md bg-gray-f8/60"></div>
          <div className="table-loader absolute z-50"></div>
        </div>
      )}
    </LoadingContext.Provider>
  )
}

export const useLoading = (): LoadingContextType => {
  const context = useContext(LoadingContext)
  if (!context) {
    throw new Error('useLoading must be used within a LoadingProvider')
  }
  return context
}
