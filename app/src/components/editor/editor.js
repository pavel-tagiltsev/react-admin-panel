import React, {Component} from "react";
import axios from 'axios';

export default class Editor extends Component {
    constructor() {
        super();

        this.state = {
            pageList: [],
            newPageName: ''
        };

        this.createNewPage = this.createNewPage.bind(this);
    }

    componentDidMount() {
        this.loadPageList();
    }

    loadPageList() {
        axios
            .get('./api')
            .then((res) => this.setState({pageList: res.data}));
    }

    createNewPage() {
        axios
            .post('./api/createNewPage.php', {'name': this.state.newPageName})
            .then(this.loadPageList())
            .catch(() => alert('Страница уже существует.'));
    }

    render() {
        const {pageList} = this.state;
        const pages = pageList.map((page, i) => {
            return (
                <h1 key={i}>{page}</h1>
            )
        });

        return (
            <>
                <input 
                onChange={(evt) => {this.setState({newPageName: evt.target.value})}}
                type="text"/>
                <button onClick={this.createNewPage}>Create a page</button>
                {pages}
            </>
        )
    }
}