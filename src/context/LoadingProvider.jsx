// context/LoadingContext.jsx
import { useContext, useState } from "react";
import { LoadingContext, SetLoadingContext } from "./LoadingContext";

export const useLoading = () => useContext(LoadingContext);
export const useSetLoading = () => useContext(SetLoadingContext);

export const LoadingProvider = ({ children }) => {
    const [loadingCount, setLoadingCount] = useState(0);

    // 백에서 불러오는건 비동기적 요청 => 언제 끝날지 모름
    // 컴포넌트들 요청 끝나면 stopLoading으로 들어가서
    // 따라서 loadingCount 형태는 +2-1+3-1-1-1-1=0 인 것 (+1-1+1-1=0이 아니라)
    // loadingCount===0 (=비동기 작업 끝)이 될 때까지 '로딩중' 뜸
    const startLoading = () => setLoadingCount((prev) => prev + 1);
    const stopLoading = () => setLoadingCount((prev) => prev - 1);

    const isConponentLoading = loadingCount > 0;

    return (
        <LoadingContext.Provider value={isConponentLoading}>
            <SetLoadingContext.Provider value={{ startLoading, stopLoading }}>
                {children}
            </SetLoadingContext.Provider>
        </LoadingContext.Provider>
    );
};
