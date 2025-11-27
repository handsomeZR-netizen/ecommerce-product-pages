import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { GlowButton } from './GlowButton';

describe('GlowButton', () => {
  it('should trigger onClick when clicked', () => {
    const handleClick = vi.fn();
    render(<GlowButton onClick={handleClick}>Click Me</GlowButton>);

    const button = screen.getByRole('button', { name: /click me/i });
    fireEvent.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should update CSS variables on mouse move', () => {
    render(<GlowButton>Hover Me</GlowButton>);

    const button = screen.getByRole('button', { name: /hover me/i });

    // Simulate mouse move
    fireEvent.mouseMove(button, { clientX: 100, clientY: 50 });

    // Check if CSS variables are set
    const mouseX = button.style.getPropertyValue('--mouse-x');
    const mouseY = button.style.getPropertyValue('--mouse-y');

    expect(mouseX).toBeTruthy();
    expect(mouseY).toBeTruthy();
  });

  it('should apply primary variant styles', () => {
    render(<GlowButton variant="primary">Primary</GlowButton>);

    const button = screen.getByRole('button', { name: /primary/i });

    expect(button.className).toContain('from-blue-600');
    expect(button.className).toContain('to-purple-600');
  });

  it('should apply secondary variant styles', () => {
    render(<GlowButton variant="secondary">Secondary</GlowButton>);

    const button = screen.getByRole('button', { name: /secondary/i });

    expect(button.className).toContain('bg-white');
    expect(button.className).toContain('border-2');
  });

  it('should render children and arrow icon', () => {
    render(<GlowButton>Test Button</GlowButton>);

    expect(screen.getByText('Test Button')).toBeInTheDocument();

    const button = screen.getByRole('button');
    const svg = button.querySelector('svg');

    expect(svg).toBeInTheDocument();
  });
});
