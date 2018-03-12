import { troopClient } from '@shanghai/troop-adapter';
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
    student_course_enrollment(id:String!):[student_course_enrollment]
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
  const { selections } = info.fieldNodes[0].selectionSet;
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

const getSelections = (selections, field) => {
  if (selections.length <= 1) {
    return selections;
  }
  return selections.filter(sel => sel.name.value === field);
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
  typeResolver[key] = (root, { id }, { currentContext: troopContext, query }, info) => {
    if (!shouldRequest(root, info)) {
      return root[info.resultKey];
    }
    let _query = null;
    if (id) {
      _query = Array.isArray(id) ? id.map(_id => `${_type}!${_id}`).join('|') : `${_type}!${id}`;
    } else if (root[info.resultKey]) {
      _query = root[info.resultKey].id;
    }

    _query += constructTroopQuery(
      getSelections(query.definitions[0].selectionSet.selections, info.resultKey),
      ''
    );

    return troopClient.query(config.troopQueryContext, `${_query}`, { troopContext });
  };
});

const studentCourseEnrollment = (root, { id }, { currentContext: troopContext, query }, info) => {
  if (!shouldRequest(root, info)) {
    return root[info.fieldName];
  }

  const selection = query.definitions[0].selectionSet.selections[0];
  let _query = null;
  if (id) {
    _query = `${selection.name.value}!${id}`;
  } else if (root.courseLocation) {
    _query = root.courseLocation.id;
  }
  _query += constructTroopQuery(selection.selectionSet.selections, '');
  return troopClient.query(config.troopQueryContext, _query, { troopContext });
};

export default {
  Query: {
    student_course_enrollment: studentCourseEnrollment,
    ...typeResolver
  },

  Mutation: {
    updateCurrentEnrollment: async (root, { templateId }, { currentContext: troopContext }) => {
      await troopClient.postCommand(
        `${config.troopContext}/school/command/enrollment/updatecurrentenrollment`,
        { templateId },
        { troopContext }
      );
      return troopClient
        .query(config.troopQueryContext, `student_course_enrollment!current`, {
          troopContext
        })
        .then(results => results[0]);
    }
  }
};
