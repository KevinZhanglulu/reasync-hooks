import React, { useEffect, useState } from "react";
import { notifier } from "./conponent/Notification";
import { Button } from "./conponent/Button/Button";

const BasisExample = () => {
    //Mock that fetch data successfully
    const fetchDataSuccess = () =>
        new Promise(function(resolve) {
            setTimeout(function() {
                //Receive data
                resolve({ profile: { email: "someone@email.com" } });
            }, 1000);
        });

    //Mock that an error occurs when fetch data
    const fetchDataError = () =>
        new Promise(function(resolve, reject) {
            setTimeout(function() {
                //An error occurs
                reject({ msg: "something wrong" });
            }, 1000);
        });

    const [isFulfilledAsyncPending, setIsFulfilledAsyncPending] = useState(false);
    const [data, setSetData] = useState();

    const [isRejectedAsyncPending, setIsRejectedAsyncPending] = useState(false);
    const [error, setError] = useState();

    useEffect(() => {
        if (data) notifier.success(data.profile.email);
        if (error) notifier.error(error.msg);
    }, [data, error]);

    return (
        <div className="App">
            <Button
                onClick={() => {
                    setIsFulfilledAsyncPending(true);
                    fetchDataSuccess().then(data => {
                        setIsFulfilledAsyncPending(false);
                        setSetData(data);
                    });
                }}
                isLoading={isFulfilledAsyncPending}
                isPrimary={true}
            >
                asyncFulfilledAction
            </Button>
            <Button
                onClick={() => {
                    setIsRejectedAsyncPending(true);
                    fetchDataError().catch(error => {
                        setIsRejectedAsyncPending(false);
                        setError(error);
                    });
                }}
                isLoading={isRejectedAsyncPending}
                isPrimary={true}
            >
                asyncRejectedAction
            </Button>
        </div>
    );
};

const App = () => (<BasisExample />);

export default App;
