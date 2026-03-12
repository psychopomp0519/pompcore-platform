/**
 * @file sharingStore.ts
 * @description 가계부 공유 상태 관리 Zustand 스토어
 * @module stores/sharingStore
 */

import { create } from 'zustand';
import type { SharedVault, VaultInvitation, SharePermission } from '../types/sharing.types';
import * as sharingService from '../services/sharing.service';
import { toUserMessage } from '@pompcore/ui';

// ============================================================
// 타입
// ============================================================

interface SharingState {
  /** 내가 공유한 목록 */
  myShares: SharedVault[];
  /** 나에게 공유된 목록 */
  sharedWithMe: SharedVault[];
  /** 내 초대 목록 */
  invitations: VaultInvitation[];
  isLoading: boolean;
  error: string | null;
}

interface SharingActions {
  load: (userId: string) => Promise<void>;
  createInvitation: (userId: string, permission?: SharePermission, maxUses?: number) => Promise<VaultInvitation>;
  deactivateInvitation: (invitationId: string) => Promise<void>;
  removeShare: (shareId: string) => Promise<void>;
  acceptInvitation: (code: string, viewerId: string) => Promise<void>;
  clearError: () => void;
}

// ============================================================
// 스토어
// ============================================================

export const useSharingStore = create<SharingState & SharingActions>()(
  (set, get) => ({
    myShares: [],
    sharedWithMe: [],
    invitations: [],
    isLoading: false,
    error: null,

    load: async (userId) => {
      set({ isLoading: true, error: null });
      try {
        const [myShares, sharedWithMe, invitations] = await Promise.all([
          sharingService.fetchMyShares(userId),
          sharingService.fetchSharedWithMe(userId),
          sharingService.fetchMyInvitations(userId),
        ]);
        set({ myShares, sharedWithMe, invitations, isLoading: false });
      } catch (err) {
        set({ error: toUserMessage(err), isLoading: false });
      }
    },

    createInvitation: async (userId, permission = 'read', maxUses = 1) => {
      set({ error: null });
      try {
        const invitation = await sharingService.createInvitation(userId, permission, maxUses);
        set({ invitations: [invitation, ...get().invitations] });
        return invitation;
      } catch (err) {
        set({ error: toUserMessage(err) });
        throw err;
      }
    },

    deactivateInvitation: async (invitationId) => {
      try {
        await sharingService.deactivateInvitation(invitationId);
        set({
          invitations: get().invitations.map((inv) =>
            inv.id === invitationId ? { ...inv, isActive: false } : inv,
          ),
        });
      } catch (err) {
        set({ error: toUserMessage(err) });
      }
    },

    removeShare: async (shareId) => {
      try {
        await sharingService.removeShare(shareId);
        set({
          myShares: get().myShares.filter((s) => s.id !== shareId),
          sharedWithMe: get().sharedWithMe.filter((s) => s.id !== shareId),
        });
      } catch (err) {
        set({ error: toUserMessage(err) });
      }
    },

    acceptInvitation: async (code, viewerId) => {
      set({ error: null });
      try {
        await sharingService.acceptInvitation(code, viewerId);
      } catch (err) {
        set({ error: toUserMessage(err) });
        throw err;
      }
    },

    clearError: () => set({ error: null }),
  }),
);
