import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ProgressBar, CircularProgress } from '@/components/ui/Progress';

// ─── Button ───────────────────────────────────────────────────────────────────

describe('Button', () => {
  it('renders children', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
  });

  it('calls onClick when clicked', async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Go</Button>);
    await userEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Disabled</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('is disabled when loading prop is true', () => {
    render(<Button loading>Loading</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('shows spinner when loading', () => {
    render(<Button loading>Submit</Button>);
    // Loading replaces children with a spinner span
    expect(screen.queryByText('Submit')).not.toBeInTheDocument();
    expect(screen.getByRole('button').querySelector('span')).toBeInTheDocument();
  });

  it('does not fire onClick when disabled', async () => {
    const onClick = vi.fn();
    render(<Button disabled onClick={onClick}>No</Button>);
    await userEvent.click(screen.getByRole('button'));
    expect(onClick).not.toHaveBeenCalled();
  });

  it('applies primary variant classes by default', () => {
    render(<Button>Primary</Button>);
    const btn = screen.getByRole('button');
    expect(btn.className).toContain('bg-[#C8FF00]');
  });

  it('applies ghost variant class', () => {
    render(<Button variant="ghost">Ghost</Button>);
    const btn = screen.getByRole('button');
    expect(btn.className).toContain('text-[#7A7A8C]');
  });

  it('applies danger variant class', () => {
    render(<Button variant="danger">Danger</Button>);
    const btn = screen.getByRole('button');
    expect(btn.className).toContain('text-[#FF4560]');
  });

  it('applies sm size class', () => {
    render(<Button size="sm">Small</Button>);
    expect(screen.getByRole('button').className).toContain('h-8');
  });

  it('applies lg size class', () => {
    render(<Button size="lg">Large</Button>);
    expect(screen.getByRole('button').className).toContain('h-12');
  });

  it('forwards additional HTML attributes', () => {
    render(<Button type="submit" data-testid="submit-btn">Submit</Button>);
    const btn = screen.getByTestId('submit-btn');
    expect(btn).toHaveAttribute('type', 'submit');
  });

  it('merges custom className', () => {
    render(<Button className="custom-class">Custom</Button>);
    expect(screen.getByRole('button').className).toContain('custom-class');
  });
});

// ─── Badge ────────────────────────────────────────────────────────────────────
// Note: 'uppercase' is a CSS-only transform — jsdom (css:false) shows the original text.

describe('Badge', () => {
  it('renders the label text', () => {
    render(<Badge label="Strength" />);
    expect(screen.getByText('Strength')).toBeInTheDocument();
  });

  it('uses subtle variant by default (background opacity style)', () => {
    render(<Badge label="Test" color="#C8FF00" />);
    const badge = screen.getByText('Test');
    expect(badge.style.backgroundColor).toBeTruthy();
  });

  it('filled variant sets backgroundColor to the color directly', () => {
    render(<Badge label="Filled" color="#FF0000" variant="filled" />);
    const badge = screen.getByText('Filled');
    expect(badge.style.backgroundColor).toBe('rgb(255, 0, 0)');
  });

  it('applies sm size classes by default', () => {
    render(<Badge label="SM" />);
    expect(screen.getByText('SM').className).toContain('text-[10px]');
  });

  it('applies md size classes when specified', () => {
    render(<Badge label="MD" size="md" />);
    expect(screen.getByText('MD').className).toContain('text-xs');
  });

  it('renders as a span element', () => {
    render(<Badge label="Span" />);
    expect(screen.getByText('Span').tagName).toBe('SPAN');
  });

  it('applies custom className', () => {
    render(<Badge label="Custom" className="my-custom" />);
    expect(screen.getByText('Custom').className).toContain('my-custom');
  });
});

// ─── ProgressBar ──────────────────────────────────────────────────────────────

describe('ProgressBar', () => {
  it('renders without errors', () => {
    const { container } = render(<ProgressBar value={50} />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('fill width matches value percentage', () => {
    const { container } = render(<ProgressBar value={75} color="#C8FF00" />);
    // Structure: container > div.relative > div.track > div.fill (4 levels)
    const fill = container.querySelector('div > div > div > div') as HTMLElement;
    expect(fill.getAttribute('style')).toContain('75%');
  });

  it('clamps value to 0 when below 0', () => {
    const { container } = render(<ProgressBar value={-10} />);
    const fill = container.querySelector('div > div > div > div') as HTMLElement;
    expect(fill.getAttribute('style')).toContain('0%');
  });

  it('clamps value to 100 when above 100', () => {
    const { container } = render(<ProgressBar value={150} />);
    const fill = container.querySelector('div > div > div > div') as HTMLElement;
    expect(fill.getAttribute('style')).toContain('100%');
  });

  it('applies the provided color to the fill', () => {
    const { container } = render(<ProgressBar value={50} color="#FF4560" />);
    const fill = container.querySelector('div > div > div > div') as HTMLElement;
    expect(fill.getAttribute('style')).toContain('rgb(255, 69, 96)');
  });

  it('shows label when showLabel is true', () => {
    render(<ProgressBar value={42} showLabel />);
    expect(screen.getByText('42%')).toBeInTheDocument();
  });

  it('does not show label by default', () => {
    render(<ProgressBar value={42} />);
    expect(screen.queryByText('42%')).not.toBeInTheDocument();
  });

  it('applies custom height via inline style', () => {
    const { container } = render(<ProgressBar value={50} height={10} />);
    // track div is 3 levels deep: container > div.relative > div.track
    const track = container.querySelector('div > div > div') as HTMLElement;
    expect(track.getAttribute('style')).toContain('10px');
  });
});

// ─── CircularProgress ─────────────────────────────────────────────────────────

describe('CircularProgress', () => {
  it('renders an svg', () => {
    const { container } = render(<CircularProgress value={50} />);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('svg dimensions match size prop', () => {
    const { container } = render(<CircularProgress value={50} size={120} />);
    const svg = container.querySelector('svg')!;
    expect(svg.getAttribute('width')).toBe('120');
    expect(svg.getAttribute('height')).toBe('120');
  });

  it('clamps value above 100 to 100', () => {
    const { container } = render(<CircularProgress value={150} size={80} strokeWidth={6} />);
    const circles = container.querySelectorAll('circle');
    const fillCircle = circles[1];
    const radius = (80 - 6) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = Number(fillCircle.getAttribute('stroke-dashoffset'));
    // At 100%, offset should be near 0
    expect(offset).toBeCloseTo(0, 0);
  });

  it('renders children inside the SVG container', () => {
    render(
      <CircularProgress value={60}>
        <span>60%</span>
      </CircularProgress>
    );
    expect(screen.getByText('60%')).toBeInTheDocument();
  });

  it('uses correct stroke color', () => {
    const { container } = render(<CircularProgress value={50} color="#FF4560" />);
    const fillCircle = container.querySelectorAll('circle')[1];
    expect(fillCircle.getAttribute('stroke')).toBe('#FF4560');
  });
});
