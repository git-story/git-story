import GitHubAPI from 'github-api';
import path from 'path';

GitHubAPI.prototype.getRepository = function(src = "") {
	let repo = this.getRepo(src);
	repo.commit = function(tree, message, parents = [], options) {
		let data = {
			message,
			tree,
			parents
		};

		data = Object.assign({}, options, data);
		return this._request('POST', `/repos/${this.__fullname}/git/commits`, data, () => {})
			.then((response) => {
				this.__currentTree.sha = response.data.sha;
				return response;
			});
	};

	repo.getTree = function (treeSHA, recursive = false) {
		let recurStr = "";
		if ( recursive ) {
			recurStr = "?recursive="+recursive;
		}

		return this._request('GET', `/repos/${this.__fullname}/git/trees/${treeSHA}${recurStr}`, null, () => {});
	};

	repo.getTreeByRef = function(ref = "", recursive = false) {
		return new Promise((resolve, reject) => {
			this.getRef(ref).then((res) => {
				let refData = res.data;
				let refObject = refData.object;

				if ( refObject.type === "commit" ) {
					this.getCommit(refObject.sha).then((res) => {
						let commitData = res.data;

						this.getTree(refObject.sha, recursive).then((res) => {
							let treeData = res.data;
							treeData.ref = refData.ref;
							treeData.refStr = ref;
							treeData.commitSha = commitData.sha;

							resolve(treeData);
						});
					});
				}
			}).catch(reject);
		});
	};


	const _createBlob = (file, _path) => {
		return new Promise((resolve, reject) => {
			if ( typeof file === "object") {
				if ( file.content ) {
				// create blob
				repo.createBlob(file.content).then((res) => {
					let blobData = res.data;
					file.mode = "100644";
					file.sha = blobData.sha;
					file.path = _path;
					if ( file.content ) {
						delete file.content;
					}
					resolve(file);
				});
				} else {
					// delete blob
					let rtnData = {
						path: _path,
						mode: "100644",
						type: "blob",
						sha : null
					}
					resolve(rtnData);
				}
			} else {
				reject(new Error("file type is not object"));
			}
		});
	};
	const _createTree = (treeObj) => {
		return new Promise((resolve, reject) => {
			if ( Array.isArray(treeObj) ) {
				// create blob
				repo.createTree(treeObj).then((res) => {
					resolve(res.data);
				});
			} else {
				reject(new Error("treeObj type is not Array"));
			}
		});
	};
	const pathDetach = (pathArr = [], rootDir) => {
		let tree = {
			"type": "tree",
			"mode": "160000",
			"tree": {},
		};
		pathArr.forEach(p => {
			let _dir = path.dirname(p.path);
			let _path = []
			let _dep = tree["tree"];
			let _file = path.basename(p.path);

			if ( _dir !== "." ) {
				_path = _dir.split('/');
			}

			let _stackDir = "";
			_path.forEach(_p => {
				if ( _dep[_p] === undefined ) {
					_dep[_p] = {
						"type": "tree",
						"mode": "160000",
						"tree": {},
					};

					if ( rootDir ) {
						_stackDir = path.join(_stackDir, _p);
						let idx = rootDir.findIndex(_d => _d.path === _stackDir);
						if ( idx >= 0 ) {
							_dep[_p]["sha"] = rootDir[idx]["sha"];
						}
					}
				}
				_dep = _dep[_p]["tree"];
			});

			_dep[_file] = {
				"type": "blob",
				"mode": "100644",
				"content": p.content
			};
		});
		return tree;
	};
	// treeObj is Array type
	const _buildTree = async (tree = {}) => {
		let _dep = tree["tree"];
		let tKey = Object.keys(_dep);
		let result = [];
		let requests = [];

		let tKeyLen = tKey.length;
		for (let i=0;i<tKeyLen;i++) {
			let k = tKey[i];
			let _cur = _dep[k];
			if ( _cur["type"] === "tree" ) {
				let _changed = await _buildTree(_cur);
				let _tree = _cur["tree"];

				_changed.forEach(_c => {
					_tree[_c.path] = {
						"type": _c.type,
						"mode": _c.mode,
						"sha" : _c.sha
					};
				});

				let reqTreeArr = [];
				let _tKey = Object.keys(_tree);
				_tKey.forEach(_k => {
					let b = _tree[_k];
					b.path = _k;
					if ( b.sha ) {
						reqTreeArr.push(b);
					}
				});

				if ( _cur["sha"] ) {
					let curTreeOrig = await repo.getTree(_cur["sha"]);
					let _data = curTreeOrig.data;
					_data.tree.forEach(_dt => {
						if ( _tree[_dt.path] === undefined ) {
							// 업데이트 안 된 기존 파일들만 추가
							reqTreeArr.push(_dt);
						}
					});
				}

				let _treedata = await _createTree(reqTreeArr);

				let _TD = {
					"mode": "040000",
					"type": "tree",
					"sha" : _treedata.sha,
					"path": k
				};
				result.push(_TD);
			} else if ( _cur["type"] === "blob" ) {
				let _req = _createBlob(_cur, k);
				requests.push(_req);
			}
		}

		result = result.concat(await Promise.all(requests));
		return result;
	};


	/**
	 * [{
	 * 		"path": string,
	 * 		"content": string,
	 * 	}...]
	 */
	repo.commitFiles = function(commitMsg = "", files = []) {
		files.forEach((f, idx) => {
			if ( f.path[0] === "/" ) {
				files[idx].path = f.path.substr(1);
			}
		});

		if ( files.length === 1 ) { 
			// only one write file
			// always write file on master branche
			let f = files[0];
			return this.writeFile("master", f.path, f.content, commitMsg, { encode: true });
		}

		// when multiple file
		return new Promise((resolve, reject) => {
			let treeData = null;
			let treeObj = [];
			
			let maxDeps = 0;
			files.forEach((f) => {
				let fDeps = f.path.match(/\//g);
				if ( fDeps && fDeps.length > maxDeps ) {
					maxDeps = fDeps;
				}

				if ( typeof f.content === "object" ) {
					f.content = JSON.stringify(f.content, null, "\t");
				}

				f.content = Buffer.from(f.content, 'utf8');
			});

			this.getTreeByRef('heads/master', maxDeps).then((res) => {
				treeData = res;
				treeObj = treeData.tree;
				let dTree = pathDetach(files, treeObj);
				_buildTree(dTree).
					then((bTree) => {
						return this.getTreeByRef('heads/master').then((res) => {
							treeData = res;
							treeObj = treeData.tree;
							bTree.forEach(b => {
								let idx = treeObj.findIndex((o) => o.path === b.path);
								if ( idx === -1 ) {
									// new file
									treeObj.push(b);
								} else {
									// update file
									treeObj[idx] = b;
								}
							});
							return _createTree(treeObj);
						});
					}).
					then((res) => {
						let newTreeData = res;
						return this.commit(newTreeData.sha, commitMsg, [ treeData.sha ]);
					}).
					then((res) => {
						this.updateHead(treeData.refStr, res.data.sha, false).then(resolve);
					}).catch(reject);
			}).catch(reject);
		});
	};

	repo.getData = function(path, otherRepo, raw = false) {
		if ( otherRepo ) {
			path = path ? `${encodeURI(path)}` : '';
			return this._request('GET', `/repos/${otherRepo}/contents/${path}`, {
				ref: "master",
			}, () => {}, raw);
		} else {
			return this.getContents("master", path, raw);
		}
	};

	repo.getJsonData = function(path, otherRepo) {
		return new Promise((resolve, reject) => {
			this.getData(path, otherRepo, false).
				then((res) => {
					let data = res.data;
					let b64Content = data.content;
					let rawContent = Buffer.from(b64Content, 'base64').toString('utf8');
					let jsonContent = JSON.parse(rawContent);

					data.decodeData = rawContent;
					data.json = jsonContent;
					resolve(data);
				}).
				catch(reject);
		});
	};

	repo.createTemplateRepo = function(src, options) {
		options = options || {};
		options.AcceptHeader = 'baptiste-preview';
		return this._request('POST', `/repos/${src}/generate`, options, () => {});
	};

	return repo;
};

export default GitHubAPI;
