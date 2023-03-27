import { Dashboard } from "../../components/dashboard"

export const DashboardScreen = ({ route }) => {
    return (
        <Dashboard contextualData={route.params.contextualData}/>
    )
}
