import { useEffect, useState } from "react";
import PagesDataContextType from "interface/PagesDataContextType";
import { DataArray, DataObject } from "obsidian-dataview";
import { Platform } from "obsidian";
import { filterPages } from "Utils/filterPages";
import { filterList, pageData } from "interface/pageData";

export function usePage(pages:DataArray<DataObject>, input:pageData): PagesDataContextType {
	// 표시될 페이지
	const [rendererPages, setRendererPages] = useState(pages);
	// 현재 페이지네이션 번호
	const [currentPageNum, setCurrentPageNum] = useState(1);
	// 화면에 표시할 데이터 리스트 갯수
	const [viewListNum, setViewListNum] = useState(input.selectedValue);
	const selectedArr = input.selectedArr;

	// pagination 버튼 갯수
	const viewBtnNum = (Platform.isPhone)? 8 : 10;
	const fullPaginationNum = Math.ceil(rendererPages.length / viewListNum);

	// 필터
	const [selectFilterValue, setSelectFilterValue] = useState(
		input.filterDefault
	);
	const pagesFiltering = (
		data: DataArray<DataObject>,
		selectList: number[]
	) => {
		const renderer = data.filter((page: DataObject) => {
			let result = true;
			selectList.forEach((item) => {
				result = result && filterPages(page, input.filter[item]);
			});
			return result;
		});
		return renderer;
	};
	const handleFilter = (index: number) => {
		if (selectFilterValue.includes(index)) {
			deleteFilter(index);
		} else {
			let data = pages;
			if (index === 0) {
				setSelectFilterValue([]);
			} else {
				const selectList = [...selectFilterValue];
				selectList.push(index);
				setSelectFilterValue(selectList);

				data = pagesFiltering(data, selectList);
			}
			setFilteringPages(data);
			// filterList
			if (Object.keys(filterList).length !== 0) {
				data = appliedFilterList(data, filterList);
			}
			// 검색어가 존재할 경우
			if (searchValue !== "") {
				data = pagesSearching(data, searchValue);
			}
			setRendererPages(data);
		}
	};
	const deleteFilter = (index: number) => {
		const selectList = selectFilterValue.filter(
			(select) => select !== index
		);
		setSelectFilterValue(selectList);

		let data = pages;
		if (selectList.length !== 0) {
			data = pagesFiltering(data, selectList);
		}
		setFilteringPages(data);
		// filterList
		if (Object.keys(filterList).length !== 0) {
			data = appliedFilterList(data, filterList);
		}
		// 검색어가 존재할 경우
		if (searchValue !== "") {
			data = pagesSearching(data, searchValue);
		}
		setRendererPages(data);
	};

	// filterList
	const [filterList, setFilterList] = useState({} as {[key: string]: filterList});
	const appliedFilterList = (data: DataArray<DataObject>, list: {[key: string]: filterList}) => {
		data = data.filter((page: DataObject) => {
			let result = true;
			Object.entries(list).forEach(([key, value]) => {
				const property = page[key];
				result = result && String(property).includes(value.content);
			});
			return result;
		});
		return data;
	}
	const handleFilterList = (property: string, selected: filterList) => {
		const data = pagesFiltering(pages, selectFilterValue);
		const filterListKey = Object.keys(filterList);
		const list = { ...filterList };
		if (selected.label === "모두보기" || filterListKey.contains(property)) {
			delete list[property];
		}
		if (selected.label !== "모두보기") {
			list[property] = selected;
		}

		setFilterList({ ...list });
		const filterPages = appliedFilterList(data, list);
		setFilteringPages(filterPages);
		setRendererPages(filterPages);
	};
	const filterListItemLength = (property: string, item: filterList) => {
		const data = rendererPages[property];
		if (item.label === "모두보기") {
			return data?.length;
		} else {
			return data?.filter((d: DataObject) => String(d).includes(item.content))?.length;
		}
	}

	const [filteringPages, setFilteringPages] = useState(pagesFiltering(pages, selectFilterValue));

	// 검색
	const [searchValue, setSearchValue] = useState("");
	const pagesSearching = (data: DataArray<DataObject>, search: string) => {
		let searchPages = data;
		if (search !== "") {
			search = search.toLowerCase().trim();

			searchPages = data?.filter((page: DataObject) => {
				if (page.file) {
					return page.file.name.toLowerCase().includes(search)
				} else {
					const rows = input.rows;
					let isFilter = false;
					rows.forEach((row) => {
						const value = page[row];
						if (value) {
							isFilter =
								isFilter ||
								String(value).toLowerCase().includes(search);
						}
					});
					return isFilter;
				}
			});
		}
		return searchPages;

	};
	const handleSearch = (search: string) => {
		setSearchValue(search);
		const initPages = (selectFilterValue.length !== 0) ? filteringPages : pages;
		setRendererPages(pagesSearching(initPages, search));
	};
	const handleSearchInit = () => {
		const initPages = (selectFilterValue.length !== 0) ? filteringPages : pages;
		setSearchValue("");
		setRendererPages(initPages);
	};
	// 정렬
	const [selectSortNum, setSelectSortNum] = useState(input.selectedSortValue);
	const pagesSorting = (index: number) => {
		const selectSort = input.sort[index];
		if (selectSort.type === "csv") {
			if (index !== selectSortNum) {
				return rendererPages.values = rendererPages.values.reverse();
			} else {
				return rendererPages;
			}
		}

		if (selectSort.type.includes("file")) {
			const fileType = selectSort?.type.substring(
				selectSort.type.indexOf("file.") + 5,
				selectSort.type.length
			);
			return rendererPages.sort((b: DataObject) => b.file[fileType],selectSort.sort);
		}

		return rendererPages.sort((b: DataObject) => b[selectSort.type],selectSort.sort);
	};
	const handleSort = (index: number) => {
		if (index !== selectSortNum) {
			setSelectSortNum(index);
			setRendererPages(pagesSorting(index));
		}
	};

	// 페이지 슬라이스
	const pageSlice = () => {
		// 정렬
		const renderData = pagesSorting(selectSortNum);
		// 슬라이스
		if (input.options.includes("noPagination")) {
			const data = renderData.slice(0, viewListNum);
			return data;
		}
		const startNum = (currentPageNum - 1) * viewListNum;
		const endNum = (currentPageNum - 1) * viewListNum + viewListNum;
		const data = renderData.slice(startNum, endNum);
		return data;
	};
	
	useEffect(() => {
		let data = pages;
		// 필터링
		if (selectFilterValue?.length !== 0) {
			data = pagesFiltering(data, selectFilterValue);
		}
		// filterList
		if (Object.entries(filterList).length !== 0) {
			data = appliedFilterList(data, filterList);
		}
		// 검색
		if (searchValue !== "") {
			data = pagesSearching(data, searchValue);
		}

		setRendererPages(data);
	}, [pages]);

	return {
		rendererPages,
		setRendererPages,
		currentPageNum,
		setCurrentPageNum,
		viewListNum,
		setViewListNum,
		viewBtnNum,
		fullPaginationNum,
		selectedArr,
		searchValue,
		setSearchValue,
		handleSearch,
		handleSearchInit,
		selectFilterValue,
		setSelectFilterValue,
		handleFilter,
		deleteFilter,
		selectSortNum,
		setSelectSortNum,
		handleSort,
		pagesSearching,
		pagesFiltering,
		pagesSorting,
		pageSlice,
		filterList,
		appliedFilterList,
		handleFilterList,
		filterListItemLength
	};
}

