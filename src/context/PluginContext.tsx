import PageDataViewPlugin from "main";
import { createContext, useContext } from "react";

export const PluginContext = createContext<PageDataViewPlugin | null>(null);
export const usePlugin = (): PageDataViewPlugin => {
    const pluginContext = useContext(PluginContext);
    if (!pluginContext) {
		throw new Error("pluginContext has to be used within <pluginContext.Provider>");
    }
    return pluginContext;
}