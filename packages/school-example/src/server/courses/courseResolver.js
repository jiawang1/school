import { troopClient } from '@school/troop-adapter';
import config from '../../../base.config';

const courseSchema = `
  type student_course_enrollment{
    id : String
    studentCourseId: String
    studentLevelId:String
    studentUnitId: String
    studentLessonId: String
    studentCourse:student_course
    studentLevel:student_level
    studentUnit:student_unit
    studentLesson:student_lesson
  }

  type image {
    id: String
    url: String
  }

  type progress{
    score: Int
    state:Int
    startDate:Int
    id:String
  }

  type student_lesson {
    lessonImage: image
    progress: progress
    studentLessonId:String
    templateLessonId:Int
    courseVersion:String
    lessonName:String
    lessonNo:Int
    lessonDesc:String
    lessonTypeId:Int
    lessonTypeName:String
    legacyLessonId:Int
    parent:student_unit
    isTemplate:Boolean
    itemTypeId:Int
    lastModified:Int
    id:String

  }

  type student_unit{
    unitImage:image
    progress: progress
    studentUnitId: String
    templateUnitId: Int
    courseVersion: String
    unitNo: Int
    unitName : String
    unitDesc : String
    legacyUnitId: Int
    children:[student_lesson]
    parent:student_level
    isTemplate:Boolean
    itemTypeId:Int
    lastModified:Int
    id:String
  }

  type student_level{
    progress: progress
    studentLevelId :String
    templateLevelId:String
    courseVersion:String
    levelCode:String
    levelNo: Int
    levelName:String
    legacyLevelId:String
    enrollDate:String
    parent: student_course
    isTemplate:Boolean
    itemTypeId:Int
    lastModified:String
    id: String
    children: [student_unit]
  }

  type student_course {
    id : String
    courseName : String
    courseTypeCode: String
    courseVersion: String
    isTemplate: Boolean
    itemTypeId : Int
    lastModified : Int
    studentCourseId : String
    templateCourseId : Int
    courseLocation: student_course_enrollment
    children: [student_level]
  }

  type Query{
    studentCourseEnrollment(id:String!):[student_course_enrollment]
    studentLevel(id:[String]):[student_level]
    studentLevelProgress(id:[String]):[progress]
    studentCourse(id:[String]):[student_course]
    studentUnit(id:[String]):[student_unit]
    studentUnitProgress(id:[String]):[progress]
    studentLesson(id:[String]):[student_lesson]
    studentLessonProgress(id:[String]):[progress]
  }

  type Mutation{
    updateCurrentEnrollment(templateId :String):student_course_enrollment

  }

`;

export { courseSchema };

const shouldRequest = (parent, info) => {
  if (!parent || !parent[info.fieldName]) {
    return true;
  }
  const currentNode = parent[info.fieldName];
  const selections = info.fieldNodes[0].selectionSet.selections;
  return selections.some(
    sel => sel.name.value !== '__typename' && currentNode[sel.name.value] === undefined
  );
};

const constructTroopQuery = (selections, parent) => {
  if (!selections) return parent;

  let hasSibling = false;
  return selections.reduce((str, field) => {
    if (field.name.value === '__typename') return str;
    let query = str;
    if (field.selectionSet) {
      if (hasSibling) {
        query = `${query},${parent}.${field.name.value}`;
      } else {
        hasSibling = true;
        query = `${query}.${field.name.value}`;
      }
      return constructTroopQuery(field.selectionSet.selections, query);
    }
    return query;
  }, parent);
};

const typeResolver = {};

[
  'student_level',
  'student_course',
  'student_unit',
  'student_lesson',
  'student_lesson_progress',
  'student_unit_progress',
  'student_level_progress'
].forEach(_type => {
  const key = _type
    .split('_')
    .map((k, inx) => {
      if (inx > 0) return k[0].toUpperCase() + k.slice(1);
      return k;
    })
    .join('');
  typeResolver[key] = (root, { id }, { currentContext: troopContext }, info) => {
    if (!shouldRequest(root, info)) {
      return root[info.fieldName];
    }
    let _query = null;
    if (id) {
      _query = id.map(_id => `${_type}!${_id}`).join('|');
    } else if (root[info.fieldName]) {
      _query = root[info.fieldName].id;
    }
    _query += constructTroopQuery(info.fieldNodes[0].selectionSet.selections, '');

    return troopClient.query(config.troopQueryContext, `${_query}`, { troopContext });
  };
});

const studentCourseEnrollment = (root, { id }, { currentContext: troopContext }, info) => {
  if (!shouldRequest(root, info)) {
    return root[info.fieldName];
  }

  const selections = info.fieldNodes[0].selectionSet.selections;
  let _query = null;
  if (id) {
    _query = `student_course_enrollment!${id}`;
  } else if (root.courseLocation) {
    _query = root.courseLocation.id;
  }
  _query += constructTroopQuery(selections, '');
  return troopClient.query(config.troopQueryContext, _query, { troopContext });
};

export default {
  Query: {
    studentCourseEnrollment,
    ...typeResolver
  },

  Mutation: {
    updateCurrentEnrollment: async (
      root,
      { templateId },
      { currentContext: troopContext },
      info
    ) => {
      const result = await troopClient.postCommand(
        `${config.troopContext}/school/command/enrollment/updatecurrentenrollment`,
        { templateId },
        { troopContext }
      );
      return troopClient.query(config.troopQueryContext, `student_course_enrollment!current`, {
        troopContext
      });
    }
  }
};
