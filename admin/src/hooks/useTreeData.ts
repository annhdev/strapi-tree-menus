import {useContext} from "react";
import {MenuDataContext} from "../components/MenuDataProvider";

const useTreeData = ()=>useContext(MenuDataContext);

export default useTreeData;
