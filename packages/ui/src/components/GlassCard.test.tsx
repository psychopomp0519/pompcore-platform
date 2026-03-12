import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { GlassCard } from './GlassCard';

afterEach(cleanup);

describe('GlassCard', () => {
  it('children 렌더링', () => {
    render(<GlassCard>카드 내용</GlassCard>);
    expect(screen.getByText('카드 내용')).toBeInTheDocument();
  });

  it('기본 padding=md', () => {
    const { container } = render(<GlassCard>내용</GlassCard>);
    expect(container.firstChild).toHaveClass('p-4');
  });

  it('padding=sm', () => {
    const { container } = render(<GlassCard padding="sm">내용</GlassCard>);
    expect(container.firstChild).toHaveClass('p-3');
  });

  it('padding=lg', () => {
    const { container } = render(<GlassCard padding="lg">내용</GlassCard>);
    expect(container.firstChild).toHaveClass('p-6');
  });

  it('onClick 전달 시 role=button + tabIndex', () => {
    const onClick = vi.fn();
    render(<GlassCard onClick={onClick}>클릭</GlassCard>);
    const card = screen.getByRole('button');
    expect(card).toBeInTheDocument();
    expect(card).toHaveAttribute('tabindex', '0');
    fireEvent.click(card);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('onClick 없으면 role=button 없음', () => {
    const { container } = render(<GlassCard>내용</GlassCard>);
    const div = container.firstChild as HTMLElement;
    expect(div.getAttribute('role')).toBeNull();
  });

  it('Enter 키로 onClick 실행', () => {
    const onClick = vi.fn();
    render(<GlassCard onClick={onClick}>키보드</GlassCard>);
    const card = screen.getByRole('button');
    fireEvent.keyDown(card, { key: 'Enter' });
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('커스텀 className 적용', () => {
    const { container } = render(<GlassCard className="custom-class">내용</GlassCard>);
    expect(container.firstChild).toHaveClass('custom-class');
  });
});
