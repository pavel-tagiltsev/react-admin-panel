import React, {Component} from "react";
import axios from 'axios';
import '../../helpers/iframeLoader.js';

export default class Editor extends Component {
    constructor() {
        super();
        this.currentPage = 'index.html';
        this.state = {
            pageList: [],
            newPageName: ''
        };

        this.createNewPage = this.createNewPage.bind(this);
    }

    componentDidMount() {
        this.init(this.currentPage);
    }

    init(page) {
        this.iframe = document.querySelector('iframe');
        this.open(page);
        this.loadPageList();
    }

    open(page) {
        this.currentPage = `../${page}`;
        this.iframe.load(this.currentPage, () => {
            console.log(this.currentPage);
        });
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

    deletePage(page) {
        axios
            .post('./api/deletePage.php', {'name': page})
            .then(this.loadPageList())
            .catch(() => alert('Страницы не существуе.'));
    }

    render() {
        // const {pageList} = this.state;
        // const pages = pageList.map((page, i) => {
        //     return (
        //         <h1 key={i}>{page}
        //             <a
        //             href="#"
        //             onClick={() => this.deletePage(page)}>(x)</a>
        //         </h1>
        //     )
        // });

        return (
            <iframe src={this.currentPage} frameBorder="0"></iframe>
            // <>
            //     <input 
            //     onChange={(evt) => {this.setState({newPageName: evt.target.value})}}
            //     type="text"/>
            //     <button onClick={this.createNewPage}>Create a page</button>
            //     {pages}
            // </>
        )
    }
}