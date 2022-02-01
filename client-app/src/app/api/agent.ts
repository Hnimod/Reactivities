import axios, { AxiosError, AxiosResponse } from "axios";
import { toast } from "react-toastify";

import { history } from "../..";
import { Activity, ActivityFormValues } from "../models/activity";
import { User, UserFormValues } from "../models/users";
import { store } from "../stores/store";

const sleep = (delay: number) => {
  return new Promise(resolve => {
    setTimeout(resolve, delay);
  });
};

export const httpFactory = async <T>(fn: Promise<T>): Promise<Result<T>> => {
  try {
    const res = await fn;
    return Result.Success(res);
  } catch (error) {
    return Result.Failure(error);
  }
};

export class Result<T> {
  readonly isSuccess: boolean;
  readonly error: any;
  readonly value: T | null;

  constructor(isSuccess: boolean, error: any, value: T | null) {
    this.isSuccess = isSuccess;
    this.error = error;
    this.value = value;
  }

  public static Success = <T>(value: T) => new Result<T>(true, null, value);
  public static Failure = <T>(error: any) => new Result<T>(false, error, null);
}

axios.defaults.baseURL = "http://localhost:5000/api";

axios.interceptors.request.use(config => {
  const token = store.commonStore.token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

axios.interceptors.response.use(
  async response => {
    await sleep(1000);
    return response;
  },
  (error: AxiosError) => {
    const { data, status, config } = error.response!;
    switch (status) {
      case 400:
        if (typeof data === "string") toast.error(data);
        if (config.method?.toLowerCase() === "get" && data.errors.hasOwnProperty("id")) {
          history.push("/not-found");
        }
        if (data.errors) {
          const modalStateErrors = [];
          for (const key in data.errors) {
            if (data.errors[key]) modalStateErrors.push(data.errors[key]);
          }
          toast.error("400");
          throw modalStateErrors.flat();
        }
        break;
      case 401:
        toast.error("Unauthorized");
        break;
      case 404:
        history.push("/not-found");
        break;
      case 500:
        store.commonStore.setServerError(data);
        history.push("/server-error");
        break;
      default:
        toast.error("Something wrong");
    }
    return Promise.reject(error);
  }
);

const requestBody = <T>(response: AxiosResponse<T>) => response.data;

const requests = {
  get: <T>(url: string) => httpFactory(axios.get<T>(url).then(requestBody)),
  post: <T>(url: string, body: object) => httpFactory(axios.post<T>(url, body).then(requestBody)),
  put: <T>(url: string, body: object) => httpFactory(axios.put<T>(url, body).then(requestBody)),
  delete: <T>(url: string) => httpFactory(axios.delete<T>(url).then(requestBody)),
};

const Activities = {
  list: () => requests.get<Activity[]>("/activities"),
  details: (id: string) => requests.get<Activity>(`/activities/${id}`),
  create: (activity: ActivityFormValues) => requests.post<void>("/activities", activity),
  update: (activity: ActivityFormValues) =>
    requests.put<void>(`/activities/${activity.id}`, activity),
  delete: (id: string) => requests.delete<void>(`/activities/${id}`),
  attend: (id: string) => requests.post<void>(`activities/${id}/attend`, {}),
};

const Account = {
  me: () => requests.get<User>("/account/me"),
  login: (user: UserFormValues) => requests.post<User>("/account/login", user),
  register: (user: UserFormValues) => requests.post<User>("/account/register", user),
};

const agent = {
  Activities,
  Account,
};

export default agent;
