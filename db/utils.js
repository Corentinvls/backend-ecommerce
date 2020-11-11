function createAndUpdateAt(object,created=false) {
    return created?  object.createdAt= new Date():  object.updatedAt= new Date();
}
exports.createAndUpdateAt=createAndUpdateAt