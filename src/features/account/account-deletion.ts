export class ApiError extends Error {
  code: string;
  kind: string;
  status?: number;
  retryable?: boolean;

  constructor(
    message: string,
    options: { code: string; kind: string; status?: number; retryable?: boolean },
  ) {
    super(message);
    this.name = "ApiError";
    this.code = options.code;
    this.kind = options.kind;
    this.status = options.status;
    this.retryable = options.retryable;
  }
}

export interface IdentityDto {
  provider?: string;
  clerkUserId: string;
  userId: string | null;
  provisioned: boolean;
}

export const ACCOUNT_DELETE_RETRY_MESSAGE =
  "We could not confirm that your Gav List data was deleted. Please try again.";

export interface AccountDeletionApi {
  deleteIdentity(): Promise<void>;
  getIdentity(): Promise<IdentityDto>;
}

export interface AccountDeletionDependencies {
  api?: AccountDeletionApi;
  deleteProviderUser: () => Promise<unknown>;
}

export async function deleteAccount({
  api,
  deleteProviderUser,
}: AccountDeletionDependencies): Promise<void> {
  if (api) {
    try {
      await api.deleteIdentity();
    } catch (error) {
      if (!(error instanceof ApiError) || error.kind !== "transport") {
        throw error;
      }

      let identity: IdentityDto;
      try {
        identity = await api.getIdentity();
      } catch {
        throw new Error(ACCOUNT_DELETE_RETRY_MESSAGE);
      }
      if (identity.provisioned) {
        throw new Error(ACCOUNT_DELETE_RETRY_MESSAGE);
      }
    }
  }

  await deleteProviderUser();
}
