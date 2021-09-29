import React, {Component} from "react";
import axios from 'axios';
import '../../helpers/iframeLoader.js';
import DOMHelper from "../../helpers/dom-helper";

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
        // this.loadPageList();
    }

    open(page) {
        this.currentPage = page;

        axios
            .get(`../${page}?rnd=${Math.random()}`)
            .then((res) => DOMHelper.parseStrToDOM(res.data))
            .then(DOMHelper.wrapTextNodes)
            .then((dom) => {
                this.virtualDom = dom;
                return dom;
            })
            .then(DOMHelper.serializeDOMToString)
            .then((html) => axios.post('./api/saveTempPage.php', {html}))
            .then(() => this.iframe.load('../temp.html'))
            .then(() => this.enableEditing());
    }

    save() {
        const newDom = this.virtualDom.cloneNode(this.virtualDom);
        DOMHelper.unwrapTextNodes(newDom);
        const html = DOMHelper.serializeDOMToString(newDom);
        axios
            .post("./api/savePage.php", {pageName: this.currentPage, html})
    }

    enableEditing() {
        this.iframe.contentDocument.body.querySelectorAll('text-editor').forEach((element) => {
            element.contentEditable = 'true';
            element.addEventListener('input', () => {
                this.onTextEdit(element);
            })
        });
    }

    onTextEdit(element) {
       const id = element.getAttribute('nodeid');
       this.virtualDom.body.querySelector(`[nodeid="${id}"]`).innerHTML = element.innerHTML;
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
            <>
                <button onClick={() => this.save()}>On click</button>
                <iframe src={this.currentPage} frameBorder="0"></iframe>
            </>
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