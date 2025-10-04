import { v4 as uuidv4 } from 'uuid';
import type { Debt, CreateDebt, UpdateDebt } from '../types/debt';

// Simple in-memory storage for prototyping
let debtsDB: Debt[] = [];

// Helper function to save to localStorage
const saveToStorage = () => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('debtsDB', JSON.stringify(debtsDB));
  }
};

// Load from localStorage on service initialization
if (typeof window !== 'undefined') {
  const savedData = localStorage.getItem('debtsDB');
  if (savedData) {
    try {
      debtsDB = JSON.parse(savedData);
    } catch (error) {
      console.error('Failed to parse debts data from localStorage', error);
    }
  }
}

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// CRUD Operations
export const getDebts = async (): Promise<Debt[]> => {
  await delay(300);
  return [...debtsDB];
};

export const getDebt = async (id: string): Promise<Debt | undefined> => {
  await delay(200);
  return debtsDB.find(debt => debt.id === id);
};

export const createDebt = async (data: CreateDebt): Promise<Debt> => {
  await delay(400);
  const now = new Date().toISOString();
  const newDebt: Debt = {
    ...data,
    id: uuidv4(),
    createdAt: now,
    updatedAt: now,
  };
  
  debtsDB.push(newDebt);
  saveToStorage();
  return newDebt;
};

export const updateDebt = async (id: string, data: UpdateDebt): Promise<Debt | undefined> => {
  await delay(400);
  const index = debtsDB.findIndex(debt => debt.id === id);
  
  if (index === -1) return undefined;
  
  const updatedDebt = {
    ...debtsDB[index],
    ...data,
    updatedAt: new Date().toISOString(),
  };
  
  debtsDB[index] = updatedDebt;
  saveToStorage();
  return updatedDebt;
};

export const deleteDebt = async (id: string): Promise<boolean> => {
  await delay(300);
  const initialLength = debtsDB.length;
  debtsDB = debtsDB.filter(debt => debt.id !== id);
  const wasDeleted = debtsDB.length < initialLength;
  
  if (wasDeleted) {
    saveToStorage();
  }
  
  return wasDeleted;
};

export const searchDebts = async (query: string): Promise<Debt[]> => {
  await delay(300);
  const searchTerm = query.toLowerCase();
  return debtsDB.filter(
    debt =>
      debt.debtor.toLowerCase().includes(searchTerm) ||
      debt.description.toLowerCase().includes(searchTerm)
  );
};
