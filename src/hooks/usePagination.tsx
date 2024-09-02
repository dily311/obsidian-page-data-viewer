import React, { useCallback, useEffect, useState } from "react";

export function usePagination(
    setCurrentPageNum: React.Dispatch<React.SetStateAction<number>>,
    fullPaginationNum: number,
    viewBtnNum: number
) {
    const [startBtn, setStartBtn] = useState(1);
    const endBtn = Math.min(fullPaginationNum, startBtn + viewBtnNum - 1);

    const pageNumbers = [];
    for (let i = startBtn; i <= endBtn; i++) {
        pageNumbers.push(i);
    }
    const prev = () => {
        setStartBtn(startBtn - viewBtnNum);
        setCurrentPageNum(startBtn - viewBtnNum);
    };
    const next = () => {
        setStartBtn(startBtn + viewBtnNum);
        setCurrentPageNum(startBtn + viewBtnNum);
    };
    const paginate = (pageNum: number) => setCurrentPageNum(pageNum);
    const initPageNum = useCallback(() => {
        setCurrentPageNum(1);
        setStartBtn(1)
    }, [setCurrentPageNum, setStartBtn]);

    useEffect(() => {
        initPageNum();
    }, [initPageNum, fullPaginationNum]);

    return { pageNumbers, prev, next, paginate, startBtn, endBtn };
}
