import { useControl } from "context/ControlContext";

export default function Select() {
    console.log("Select component");

    const { state, dispatch } = useControl();
	
    return (
        <div>
            <select
                className="selectPageNum dropdown"
                aria-label="현재 표시되는 페이지 수 조절"
                value={state.query.viewListCount}
                onChange={(e) => dispatch({type: "SELECT_VIEWLISTCOUNT", payload: Number(e.target.value)})}
            >
                {state.query.viewSelectListCountArr.map((num: number) => (
                    <option key={"selected" + num} value={num}>
                        {num}
                    </option>
                ))}
            </select>
        </div>
	);
}
