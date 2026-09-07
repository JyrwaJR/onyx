import { useMutation } from '@tanstack/react-query';
import { useChatStore } from '../store/chat-store';
import { http } from '@/shared/utils/http';

export function useChangeModel() {
  const { activeSessionId } = useChatStore((state) => state.context);
  const model = useChatStore((state) => state.settings.selectedModel);

  return useMutation({
    mutationKey: ['session-model'],
    mutationFn: () =>
      http.post(`/api/session/${activeSessionId}/model`, {
        model: {
          id: model?.id,
          providerID: model?.providerID,
          variant: 'low',
        },
      }),
    onSuccess: () => {},
  });
}
