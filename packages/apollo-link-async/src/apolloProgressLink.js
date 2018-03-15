import { ApolloLink } from 'apollo-link';
import Observable from 'zen-observable';

const createProgressLink = progresshandler =>
  new ApolloLink((option, forward) => {
    const ob = forward(option);
    /** start to render  */
    progresshandler.show();

    return new Observable(observer => {
      const observerErrorHandler = observer.error.bind(observer);
      const observerCompleteHandler = observer.complete.bind(observer);
      const observerNextHandler = observer.next.bind(observer);
      ob.subscribe({
        next: ({ data, errors }) => {
          observerNextHandler({
            data,
            errors
          });
        },
        error: () => {
          // TODO
          observerErrorHandler();
          progresshandler.hide();
        },
        complete: () => {
          // TODO
          observerCompleteHandler();
          progresshandler.hide();
        }
      });
    });
  });

export default createProgressLink;
