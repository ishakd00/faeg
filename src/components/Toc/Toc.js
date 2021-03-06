import React, { Component } from "react";

import SidebarElement from "../SidebarElement";
import TreeExplorer from "../TreeExplorer";

import Urls from "../../libs/Urls";

/**
 * Sidebar element component built on top of the TreeExplorer component.
 * Shows book table of contents tree.
 */

class Toc extends Component {
	constructor(props) {
		super(props);
		this.state = {};
		this.onClickItem = this.onClickItem.bind(this);
		this.buildTreeStructure = this.buildTreeStructure.bind(this);
	}

	async onClickItem(name, structure) {
		this.props.changeOpenFile(structure.__extraData.href);
	}

	/**
	 * Generates and returns TreeExplorer table of contents tree structure from epubjs Book navigation toc object.
	 * @param {object} toc 
	 */

	buildTreeStructure(toc) {
		let newNavPoint = (el) => {
			let navPoint = buildTree(el.subitems);
			Object.defineProperty(navPoint, "__extraData", {
				value: {
					id: el.id,
					href: el.href,
					lockExpanded: true,
					noIcon: true,
					isCurrentlyOpen: el.href == this.props.openFileUrls.contentAnchored
				},
			});
			return navPoint;
		}

		let buildTree = (arr) => {
			arr = arr || [];
			let tree = Object.defineProperty({}, "__isDirectory", {
				value: true,
			});
			arr.forEach((el) => {
				tree[el.label] = newNavPoint(el);
			});
			return tree;
		}

		return buildTree(toc);
	}

	render() {	
		let structure = this.buildTreeStructure(this.props.toc);
		return (
			<SidebarElement
				expanded={this.props.expanded && Object.keys(structure).length > 0}
				onElementHeaderClicked={this.props.onElementHeaderClicked}
				title="Table of contents">
				<TreeExplorer onClickFile={this.onClickItem} onClickDirectory={this.onClickItem} structure={structure} />
			</SidebarElement>
		);
	}
}

export default Toc;

