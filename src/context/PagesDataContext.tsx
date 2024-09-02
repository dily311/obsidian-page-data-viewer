import PagesDataContextType from "interface/PagesDataContextType";
import { createContext, useContext } from "react";


export const PagesDataContext = createContext<PagesDataContextType | null>(null);
export const usePagesData = (): PagesDataContextType => {
	const pagesDataContext = useContext(PagesDataContext);
	if (!pagesDataContext) {
		throw new Error("PagesDataContext has to be used within <PagesDataContext.Provider>");
	}
	return pagesDataContext;
};
