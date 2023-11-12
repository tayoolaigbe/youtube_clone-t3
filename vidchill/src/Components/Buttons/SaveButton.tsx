import Button from "./Button";
import { api } from "~/utils/api";

import { signIn, useSession } from "next-auth/react";
import { useState, Fragment, useEffect } from "react";
import { FolderPlus, Close } from "../Icons/Icons";
import { Transition, Dialog } from "@headlessui/react";

const SaveButton = ({ videoId }: { videoId: string }) => {
  const [open, setOpen] = useState(false);
  const [checkedStatus, setCheckedStatus] = useState<{
    [key: string]: boolean;
  }>({});

  const { data: sessionData } = useSession();

  const { data: playlists, refetch: refetchPlaylists } =
    api.playlist.getSavePlaylistData.useQuery(sessionData?.user?.id as string, {
      enabled: false, // this query will not run automatically
    });

  useEffect(() => {
    if (videoId && open) {
      void refetchPlaylists();
      const initialCheckedStatus: { [key: string]: boolean } = {};
      //check if video is already part of playlist
      playlists?.forEach((playlist) => {
        initialCheckedStatus[playlist.id] = playlist.videos.some(
          (videoItem) => videoItem.videoId === videoId,
        );
      });

      setCheckedStatus(initialCheckedStatus);
    }
  }, [open]);

  const addVideoToPlaylistMutation = api.video.addVideoToPlaylist.useMutation();

  const handleCheckmarkToggle = (
    event: React.ChangeEvent<HTMLInputElement>,
    input: {
      playlistId: string;
      videoId: string;
    },
  ) => {
    addVideoToPlaylistMutation.mutate(input);
    setCheckedStatus({
      ...checkedStatus,
      [input.playlistId]: event.target.checked,
    });
  };

  const [newPlaylistName, setNewPlaylistName] = useState("");

  const createPlaylistMutation = api.playlist.addPlaylist.useMutation();
  const handleCreatePlaylist = () => {
    if (newPlaylistName) {
      createPlaylistMutation.mutate(
        {
          userId: sessionData?.user.id as string,
          title: newPlaylistName,
        },
        {
          onSuccess: () => {
            void refetchPlaylists(); // Refetch playlists data after successful mutation
            setNewPlaylistName(""); // Clear the input field
          },
        },
      );
    }
  };

  if (!videoId) {
    return <div>Loading...</div>;
  }
  return (
    <>
      <Button
        variant="secondary-gray"
        size="2xl"
        onClick={sessionData ? () => setOpen(true) : () => void signIn()}
        className="item-end flex"
      >
        <FolderPlus className="mr-2 h-5 w-5 shrink-0 stroke-gray-600" />
        Save
      </Button>
      <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={setOpen}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>
          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-100"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className=" relative m-2 flex !max-w-xs transform flex-col items-start justify-start overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-center shadow-xl transition-all sm:my-8 sm:w-full  sm:p-6">
                  <div className="absolute right-0 top-0  hidden pr-4 pt-4 sm:block">
                    <button
                      type="button"
                      className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                      onClick={() => setOpen(false)}
                    >
                      <span className="sr-only">Close</span>
                      <Close className="h-6 w-6" aria-hidden="true" />
                    </button>
                  </div>
                  <div className="mb-2 mt-5 text-center sm:mt-0">
                    <Dialog.Title
                      as="h3"
                      className=" text-base font-semibold leading-6 text-gray-900"
                    >
                      Save Video To Playlist
                    </Dialog.Title>
                  </div>
                  <fieldset className="w-full">
                    {playlists?.map((playlist) => (
                      <div key={playlist.id} className=" space-y-5  py-1 ">
                        <div className="relative flex items-start justify-start text-left">
                          <div className="flex h-6 items-center">
                            <input
                              id="comments"
                              aria-describedby="comments-description"
                              name="comments"
                              type="checkbox"
                              checked={checkedStatus[playlist.id] || false}
                              onChange={(event) =>
                                handleCheckmarkToggle(event, {
                                  videoId: videoId,
                                  playlistId: playlist.id,
                                })
                              }
                              className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-600"
                            />
                          </div>
                          <div className="ml-3 text-sm leading-6">
                            <label
                              htmlFor="comments"
                              className="font-medium text-gray-900"
                            >
                              {playlist.title}
                            </label>
                          </div>
                        </div>
                      </div>
                    ))}
                  </fieldset>
                  <div className="mt-5 flex w-full flex-col gap-2 text-left">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Name
                      </label>
                      <div className="mt-2">
                        <input
                          type="text"
                          name="text"
                          id="text"
                          value={newPlaylistName}
                          onChange={(event) => {
                            setNewPlaylistName(event.target.value);
                          }}
                          onKeyUp={(event) => {
                            if (event.key === "Enter") handleCreatePlaylist();
                          }}
                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                          placeholder="  Enter Playlist Name "
                        />
                      </div>
                    </div>
                    <Button
                      variant="primary"
                      onClick={handleCreatePlaylist}
                      className="p-2"
                      size="xl"
                    >
                      Create New Playlist
                    </Button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
};

export default SaveButton;
