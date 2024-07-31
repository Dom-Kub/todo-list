import { useCallback, useEffect, useRef, useState } from "react";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

const useMyAxios = <DataTemplate, ResponseTemplate>(
    axiosParams: AxiosRequestConfig<DataTemplate>,
    isLazy = false
) => {
    const [data, setData] =
        useState<AxiosResponse<ResponseTemplate, DataTemplate>>();
    const [loading, setLoading] = useState(false);
    let promise = useRef<
        Promise<AxiosResponse<ResponseTemplate, DataTemplate>> | undefined
    >();

    const fetchData = useCallback((params: AxiosRequestConfig<DataTemplate>) => {
        setData(undefined);
        setLoading(true);
        promise.current = axios.request<
            ResponseTemplate,
            AxiosResponse<ResponseTemplate, DataTemplate>,
            DataTemplate
        >(params);
        promise.current
            .then((res) => {
                setData(res);
            })
            .finally(() => {
                setLoading(false);
            });

        return promise.current;
    }, []);

    const sendData = (
        customAxiosParams?: AxiosRequestConfig<DataTemplate>
    ): Promise<AxiosResponse<ResponseTemplate, DataTemplate>> => {
        const newConfig = {
            ...(axiosParams || {}),
            ...(customAxiosParams || {}),
            url: customAxiosParams?.url
                ? `${window.location.protocol}//${window.location.hostname}${process.env.REACT_APP_BACKEND_SUFFIX}${customAxiosParams.url}`
                : axiosParams.url,
            headers: {
                ...(customAxiosParams?.headers || {}),
                ...(axiosParams.headers || {}),
                ...(customAxiosParams?.auth || {}),
                ...(axiosParams.auth || {}),
            },
        };
        return fetchData(newConfig);
    };

    useEffect(
        () => {
            if (axiosParams !== undefined && !isLazy) {
                fetchData(axiosParams);
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [fetchData, isLazy]
    );

    return { data, loading, promise: promise.current, sendData };
};

export default useMyAxios;
