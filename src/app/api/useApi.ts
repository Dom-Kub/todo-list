import {
    AxiosRequestConfig,
    AxiosRequestHeaders,
    AxiosResponse,
    Method,
} from "axios";
import { useLocation, useNavigate } from "react-router";
import { CONTENT_TYPES, HEADERS } from "../common/EnvironmentalVariable";
import useMyAxios from "./useMyAxios";
import { useContext } from "react";
import { ROUTE_TYPES } from "../common/RouteType";

export const useApi = <DataTemplate, ResponseTemplate = any>(
    url: string | undefined,
    method: Method = "GET",
    isLazy = false,
    config?: AxiosRequestConfig<DataTemplate>,
    headers: AxiosRequestHeaders = {
        [HEADERS.CONTENT_TYPE]: CONTENT_TYPES.APPLICATION_JSON,
        // "Access-Control-Allow-Origin": "*",
        // "Access-Control-Allow-Headers": "content-type",
        // 'Access-Control-Allow-Methods':
        // 	'POST, GET, OPTIONS, PATCH, PUT'
    }
): [
    {
        data: AxiosResponse<ResponseTemplate, DataTemplate> | undefined;
        promise: Promise<AxiosResponse<ResponseTemplate, DataTemplate>> | undefined;
        loading: boolean;
    },
    (
        customAxiosParams?: AxiosRequestConfig<DataTemplate>
    ) => Promise<AxiosResponse<ResponseTemplate, DataTemplate>>
] => {
    const navigate = useNavigate();
    const axiosResponse = useMyAxios<DataTemplate, ResponseTemplate>(
        {
            url: `https://66a742e253c13f22a3cf044e.mockapi.io/api/v1${url}`,
            method,
            headers: {
                ...headers
            },
            ...(config || {}),
        },
        isLazy
    );

    return [
        {
            data: axiosResponse.data,
            loading: axiosResponse.loading,
            promise: axiosResponse.promise,
        },
        axiosResponse.sendData,
    ];
};
