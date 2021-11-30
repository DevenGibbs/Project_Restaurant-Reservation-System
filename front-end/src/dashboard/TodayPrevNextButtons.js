import { Link, useHistory } from "react-router-dom";
import { today, previous, next } from "../utils/date-time";

export default function TodayPrevNextButtons({ date }) {
    const history = useHistory();

    return (
        <div className="row my-3">
            <button
                type="button"
                className="btn btn-secondary col mx-3"
                onClick={() => {
                    const previousDate = previous(date);
                    history.push(`/dashboard?date=${previousDate}`)
                }}
            >
                {"<< Previous Day"}
            </button>
            <Link
                className="btn btn-secondary col"
                to={`/dashboard?date=${today()}`}
            >
                Today
            </Link>
            <button
                type="button"
                className="btn btn-secondary col mx-3"
                onClick={() => {
                    const nextDate = next(date);
                    history.push(`/dashboard?date=${nextDate}`)
                }}
            >
                {"Next Day >>"}
            </button>
        </div>
    );
}