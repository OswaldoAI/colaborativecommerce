import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';

describe('App', () => {
    it('renders headline', () => {
        render(<App />);
        // Check for Hero text
        expect(screen.getByText(/Bienestar integral/i)).toBeDefined();
        // Check for Categories
        expect(screen.getByText(/Categorías Destacadas/i)).toBeDefined();
    });
});
