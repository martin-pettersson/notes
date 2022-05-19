import * as React from "react";
import { BrowserRouter as Router, Navigate, Route, Routes } from "react-router-dom";
import { Component, ReactElement } from "react";
import { Notes } from "@notes/web/components/views";
import { PropsInterface, StateInterface } from "@notes/web/components/application";

/**
 * Represents the application shell.
 */
class Application extends Component<PropsInterface, StateInterface> {
    /**
     * Produce a visual representation of the application.
     *
     * @return React element representing the application layout.
     */
    public render(): ReactElement {
        return (
            <this.props.context.Provider value={{container: this.props.container}}>
                <div className="application">
                    <div className="application__content">
                        <Router>
                            <Routes>
                                <Route path="/notes" element={<Notes/>}/>
                                <Route path="*" element={<Navigate to="/notes"/>}/>
                            </Routes>
                        </Router>
                    </div>
                </div>
            </this.props.context.Provider>
        );
    }
}

export default Application;
