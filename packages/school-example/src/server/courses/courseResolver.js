import { troopClient } from '@school/troop-adapter';
import config from '../../../base.config';

/**
 *
 *    """
    lessonImage
    progress
    """
 *
 *
 *     """
    unitImage
    progress
    """
 *
 *
 *
 *     """
    levelTest
    progress
    """
 */

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

  type progress{
    score: Int
    state:Int
    startDate:Int
    id:String
  }

  type student_lesson {
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
    studentCourse(id:[String]):[student_course]
    studentUnit(id:[String]):[student_unit]
    studentLesson(id:[String]):[student_lesson]
  }

`;

export { courseSchema };

const typeResolver = {};

['student_level', 'student_course', 'student_unit', 'student_lesson'].forEach(_type => {
  const key = _type
    .split('_')
    .map((k, inx) => {
      if (inx === 1) return k[0].toUpperCase() + k.slice(1);
      return k;
    })
    .join('');
  typeResolver[key] = (root, { id }, { currentContext }, info) => {
    console.log(info);
    let query = null;
    if (id) {
      query = id.map(_id => `${_type}!${id}`).join('|');
      return troopClient.query(config.troopContext, `${query}`, currentContext);
    } else if (root[key]) {
      return troopClient
        .query(config.troopContext, root[key].id, currentContext)
        .then(res => res[0]);
    }
  };
});

const studentCourseEnrollment = (root, { id }, { currentContext }, info) => {
  console.log('@@@@@@@@@');
  console.log(info);
  if (id) {
    return troopClient.query(
      config.troopContext,
      `student_course_enrollment!${id}`,
      currentContext
    );
  } else if (root.courseLocation) {
    return troopClient.query(config.troopContext, root.courseLocation.id, currentContext);
  }
};

export default {
  Query: {
    studentCourseEnrollment,
    ...typeResolver
  },

  student_course_enrollment: {
    ...typeResolver
  },

  student_course: {
    courseLocation: studentCourseEnrollment
  }
};
