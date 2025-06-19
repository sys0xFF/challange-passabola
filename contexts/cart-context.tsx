"use client"

import type React from "react"
import { createContext, useContext, useReducer, useEffect } from "react"

export interface Product {
  id: string
  name: string
  price: number
  image: string
  description: string
  category: string
  sizes?: string[]
}

export interface CartItem extends Product {
  quantity: number
  selectedSize?: string
}

interface CartState {
  items: CartItem[]
  total: number
  itemCount: number
}

type CartAction =
  | { type: "ADD_ITEM"; payload: { product: Product; size?: string } }
  | { type: "REMOVE_ITEM"; payload: { id: string; size?: string } }
  | { type: "UPDATE_QUANTITY"; payload: { id: string; quantity: number; size?: string } }
  | { type: "CLEAR_CART" }
  | { type: "LOAD_CART"; payload: CartState }

const CartContext = createContext<{
  state: CartState
  dispatch: React.Dispatch<CartAction>
  addItem: (product: Product, size?: string) => void
  removeItem: (id: string, size?: string) => void
  updateQuantity: (id: string, quantity: number, size?: string) => void
  clearCart: () => void
} | null>(null)

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case "ADD_ITEM": {
      const { product, size } = action.payload
      const itemKey = `${product.id}-${size || "default"}`
      const existingItem = state.items.find((item) => item.id === product.id && item.selectedSize === size)

      let newItems: CartItem[]
      if (existingItem) {
        newItems = state.items.map((item) =>
          item.id === product.id && item.selectedSize === size ? { ...item, quantity: item.quantity + 1 } : item,
        )
      } else {
        newItems = [...state.items, { ...product, quantity: 1, selectedSize: size }]
      }

      const total = newItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
      const itemCount = newItems.reduce((sum, item) => sum + item.quantity, 0)

      return { items: newItems, total, itemCount }
    }

    case "REMOVE_ITEM": {
      const { id, size } = action.payload
      const newItems = state.items.filter((item) => !(item.id === id && item.selectedSize === size))
      const total = newItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
      const itemCount = newItems.reduce((sum, item) => sum + item.quantity, 0)

      return { items: newItems, total, itemCount }
    }

    case "UPDATE_QUANTITY": {
      const { id, quantity, size } = action.payload
      if (quantity <= 0) {
        return cartReducer(state, { type: "REMOVE_ITEM", payload: { id, size } })
      }

      const newItems = state.items.map((item) =>
        item.id === id && item.selectedSize === size ? { ...item, quantity } : item,
      )
      const total = newItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
      const itemCount = newItems.reduce((sum, item) => sum + item.quantity, 0)

      return { items: newItems, total, itemCount }
    }

    case "CLEAR_CART":
      return { items: [], total: 0, itemCount: 0 }

    case "LOAD_CART":
      return action.payload

    default:
      return state
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    total: 0,
    itemCount: 0,
  })

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("copa-passa-bola-cart")
    if (savedCart) {
      try {
        const cartData = JSON.parse(savedCart)
        dispatch({ type: "LOAD_CART", payload: cartData })
      } catch (error) {
        console.error("Error loading cart from localStorage:", error)
      }
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("copa-passa-bola-cart", JSON.stringify(state))
  }, [state])

  const addItem = (product: Product, size?: string) => {
    dispatch({ type: "ADD_ITEM", payload: { product, size } })
  }

  const removeItem = (id: string, size?: string) => {
    dispatch({ type: "REMOVE_ITEM", payload: { id, size } })
  }

  const updateQuantity = (id: string, quantity: number, size?: string) => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity, size } })
  }

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" })
  }

  return (
    <CartContext.Provider
      value={{
        state,
        dispatch,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
