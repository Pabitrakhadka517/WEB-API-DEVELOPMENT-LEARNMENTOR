import { useMutation } from "@tanstack/react-query";
import axiosApi from "./axios";
import { ENDPOINTS } from "./endpoints";

/* ================= REGISTER ================= */

interface RegisterPayload {
  email: string;
  password: string;
}

export const useRegisterMutation = () => {
  return useMutation({
    mutationFn: async (data: RegisterPayload) => {
      const res = await axiosApi.post(ENDPOINTS.REGISTER, data);
      return res.data;
    },
    onError: (error: any) => {
      console.error("Registration failed:", error.response?.data?.message || error.message);
    },
    onSuccess: (data) => {
      console.log("Registration successful:", data);
    },
  });
};

export const useRegisterAdminMutation = () => {
  return useMutation({
    mutationFn: async (data: RegisterPayload) => {
      const res = await axiosApi.post(ENDPOINTS.REGISTER_ADMIN, data);
      return res.data;
    },
    onError: (error: any) => {
      console.error("Admin registration failed:", error.response?.data?.message || error.message);
    },
    onSuccess: (data) => {
      console.log("Admin registration successful:", data);
    },
  });
};

export const useRegisterUserMutation = () => {
  return useMutation({
    mutationFn: async (data: RegisterPayload) => {
      const res = await axiosApi.post(ENDPOINTS.REGISTER_USER, data);
      return res.data;
    },
    onError: (error: any) => {
      console.error("User registration failed:", error.response?.data?.message || error.message);
    },
    onSuccess: (data) => {
      console.log("User registration successful:", data);
    },
  });
};

export const useRegisterTutorMutation = () => {
  return useMutation({
    mutationFn: async (data: RegisterPayload) => {
      const res = await axiosApi.post(ENDPOINTS.REGISTER_TUTOR, data);
      return res.data;
    },
    onError: (error: any) => {
      console.error("Tutor registration failed:", error.response?.data?.message || error.message);
    },
    onSuccess: (data) => {
      console.log("Tutor registration successful:", data);
    },
  });
};

/* ================= LOGIN ================= */

interface LoginPayload {
  email: string;
  password: string;
}

export const useLoginMutation = () => {
  return useMutation({
    mutationFn: async (data: LoginPayload) => {
      const res = await axiosApi.post(ENDPOINTS.LOGIN, data);
      return res.data;
    },
    onError: (error: any) => {
      console.error("Login failed:", error.response?.data?.message || error.message);
    },
    onSuccess: (data) => {
      console.log("Login successful:", data);
    },
  });
};

/* ================= REFRESH ================= */

interface RefreshPayload {
  refreshToken: string;
}

export const useRefreshMutation = () => {
  return useMutation({
    mutationFn: async (data: RefreshPayload) => {
      const res = await axiosApi.post(ENDPOINTS.REFRESH, data);
      return res.data;
    },
    onError: (error: any) => {
      console.error("Refresh failed:", error.response?.data?.message || error.message);
    },
    onSuccess: (data) => {
      console.log("Refresh successful:", data);
    },
  });
};

/* ================= LOGOUT ================= */

export const useLogoutMutation = () => {
  return useMutation({
    mutationFn: async () => {
      const res = await axiosApi.post(ENDPOINTS.LOGOUT);
      return res.data;
    },
    onError: (error: any) => {
      console.error("Logout failed:", error.response?.data?.message || error.message);
    },
    onSuccess: (data) => {
      console.log("Logout successful:", data);
    },
  });
};