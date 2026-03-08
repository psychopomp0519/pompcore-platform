/**
 * @file @pompcore/types — Shared type definitions for the PompCore platform
 * @module @pompcore/types
 */

export type { UserRole, UserProfile, LoginRequest, RegisterRequest, AuthState, Permission } from './auth.types';
export { VALID_ROLES } from './auth.types';
export { mapUserToProfile } from './profile';
export type { SupabaseUserLike } from './profile';
export { ROLE_LABELS, ROLE_PERMISSIONS, hasPermission } from './roles';
export type { ProjectStatus, ProjectCategory, Project } from './project.types';
export type { ApiResponse, PaginatedResult } from './common.types';
export type {
  ServiceStatus, SubscriptionTier, ServiceRateLimit, ServiceQuotas,
  ServiceFeatures, ServiceConfig, Service, ServiceSubscription,
  PlatformEvent, UsageCounters, ServiceUsage,
} from './service.types';
